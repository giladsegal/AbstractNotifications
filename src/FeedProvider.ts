import * as vscode from 'vscode';
import * as path from 'path';
import {DataService} from './dataService';
import {Timer} from './Timer';
import {Organization, Project, Commit} from 'abstract-sdk';
import deepEqual = require('deep-equal');

export interface Entry {
  uri?: vscode.Uri;
  id: string;
  title: string;
  type: string;
  obj?: any;
}

export interface TreeData {
  organizations: Entry[];
  projects: Entry[];
  commits: Entry[];
}

export interface ProjectChange {
  projectName: string;
}

export class FeedProvider implements vscode.TreeDataProvider<Entry> {
  extensionPath: string;
  dataService: DataService;

  timer = new Timer(10000);
  currentTreeData?: TreeData;

  private _onDidChangeTreeData: vscode.EventEmitter<
    Entry
  > = new vscode.EventEmitter<Entry>();
  readonly onDidChangeTreeData: vscode.Event<Entry> = this._onDidChangeTreeData
    .event;

  private _onProjectChanged: vscode.EventEmitter<
    ProjectChange
  > = new vscode.EventEmitter<ProjectChange>();
  onProjectChanged = this._onProjectChanged.event;

  constructor(context: vscode.ExtensionContext, accessToken: string) {
    this.extensionPath = context.extensionPath;
    this.dataService = new DataService(accessToken);
  }

  getTreeItem(element: Entry): vscode.TreeItem {
    const treeItem = new vscode.TreeItem(
      element.uri || (element.title as any),
      vscode.TreeItemCollapsibleState.Collapsed
    );
    treeItem.label = element.title;
    treeItem.iconPath = vscode.Uri.file(
      path.join(this.extensionPath, 'resources', element.type + '.svg')
    );

    if (element.type === 'merge') {
      treeItem.collapsibleState = vscode.TreeItemCollapsibleState.None;
      // opens layer in inspect mode in browser
      treeItem.command = {
        command: 'vscode.open',
        title: 'Open',
        arguments: [
          vscode.Uri.parse(this.dataService.getCommitUrl(element.obj))
        ]
      };
    }

    return treeItem;
  }

  async getChildren(element?: Entry | undefined): Promise<Entry[]> {
    if (!this.currentTreeData) {
      this.currentTreeData = await this.getTreeData();
    }

    if (!element) {
      return this.currentTreeData.organizations;
    } else if (element.type === 'organization') {
      return this.currentTreeData.projects;
    } else if (element.type === 'project') {
      return this.currentTreeData.commits.filter(
        commit => commit.obj.projectId === element.id
      );
    }

    return [];
  }

  beginUpdating(): void {
    this.timer.run(async () => {
      console.log('Checking for changes....');
      const newTreeData = await this.getTreeData();

      if (!deepEqual(this.currentTreeData, newTreeData, {strict: true})) {
        // change that is not the initial fetch
        if (this.currentTreeData && newTreeData) {
          const currentProjects = this.currentTreeData.projects;
          const newProjects = newTreeData.projects;

          const currentProjectsWithChanges = currentProjects.filter(
            currentProject =>
              newProjects.some(
                newProject =>
                  newProject.id === currentProject.id &&
                  currentProject.obj.pushedAt !== newProject.obj.pushedAt &&
                  this.getProjectCommitCount(
                    this.currentTreeData!,
                    currentProject.id
                  ) !== this.getProjectCommitCount(newTreeData, newProject.id)
              )
          );

          console.log(`${currentProjectsWithChanges.length} projects changed!`);

          currentProjectsWithChanges.forEach(p => {
            this._onProjectChanged.fire({projectName: p.title});
          });
        }

        this.currentTreeData = newTreeData;
        this._onDidChangeTreeData.fire();
      }
      console.log('going to sleep...');
    });
  }
  stopUpdating(): void {
    this.timer.stop();
  }

  private getTreeData = async (): Promise<TreeData> => {
    const organizations = await this.dataService.getAllOrganizations();
    const projects = await this.dataService.getAllProjects();
    const commitsPerProject = await Promise.all(
      projects
        .map(p => p.id)
        .map(pid =>
          this.dataService.getAllCommits({projectId: pid, branchId: 'master'})
        )
    );
    const allCommits: Commit[] = Array.prototype.concat.apply(
      [],
      commitsPerProject
    );
    const commits = allCommits.filter(commit => commit.type === 'MERGE');

    return {
      organizations: organizations.map(this.oraganizationToEntry),
      projects: projects.map(this.projectToEntry),
      commits: commits.map(this.commitToEntry)
    };
  };

  private getProjectCommitCount = (treeData: TreeData, projectId: string) => {
    return treeData.commits.filter(c => c.obj!.projectId === projectId).length;
  };

  private oraganizationToEntry = (organization: Organization): Entry => ({
    uri: vscode.Uri.parse('abstract://org/' + organization.id),
    id: organization.id,
    title: organization.name,
    type: 'organization',
    obj: organization
  });

  private projectToEntry = (project: Project): Entry => ({
    uri: vscode.Uri.parse('abstract://project/' + project.id),
    id: project.id,
    title: project.name,
    type: 'project',
    obj: project
  });

  private commitToEntry = (commit: Commit): Entry => ({
    type: 'merge',
    id: commit.sha,
    title: commit.title,
    obj: commit
  });
}
