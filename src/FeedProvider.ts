import * as vscode from 'vscode';
import * as path from 'path';
import {DataService} from './dataService';
import {Timer} from './Timer';
// import {CommitType as AbstractCommitType} from 'abstract-sdk';

export interface Entry {
  uri?: vscode.Uri;
  id: string;
  title: string;
  type: string;
  obj?: any;
}

export class FeedProvider implements vscode.TreeDataProvider<Entry> {
  extensionPath: string;
  dataService: DataService;

  timer?: Timer = undefined;

  private _onDidChangeTreeData: vscode.EventEmitter<
    Entry
  > = new vscode.EventEmitter<Entry>();
  readonly onDidChangeTreeData: vscode.Event<Entry> = this._onDidChangeTreeData
    .event;

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

  async getChildren(
    element?: Entry | undefined
    // ): Promise<vscode.ProviderResult<Entry[]>> {
  ): Promise<Entry[]> {
    if (!element) {
      const organizations = await this.dataService.getAllOrganizations();

      return organizations.map<Entry>(org => ({
        uri: vscode.Uri.parse('abstract://org/' + org.id),
        id: org.id,
        title: org.name,
        type: 'organization',
        obj: org
      }));
    } else if (element.type === 'organization') {
      const projects = await this.dataService.getAllProjects();

      return projects.map(project => ({
        uri: vscode.Uri.parse('abstract://project/' + project.id),
        id: project.id,
        title: project.name,
        type: 'project',
        obj: project
      }));
    } else if (element.type === 'project') {
      const commits = await this.dataService.getAllCommits({
        projectId: element.id,
        branchId: 'master'
      });

      return commits.filter(commit => commit.type === 'MERGE').map(commit => {
        return {
          type: 'merge',
          id: commit.sha,
          title: commit.title,
          obj: commit
        };
      });
    }

    return [];
  }

  beginUpdating(): void {
    // throw new Error("Method not implemented.");
  }
  stopUpdating(): any {
    // throw new Error("Method not implemented.");
  }
}
