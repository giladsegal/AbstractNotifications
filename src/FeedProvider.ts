import * as vscode from 'vscode';
import * as path from 'path';
import {DataService} from './dataService';

export interface Entry {
  uri: vscode.Uri;
  id: string;
  title: string;
  type: string;
  obj: any;
}

export class FeedProvider implements vscode.TreeDataProvider<Entry> {
  extensionPath: string;
  dataService: DataService;
  constructor(context: vscode.ExtensionContext, accessToken: string) {
    this.extensionPath = context.extensionPath;
    this.dataService = new DataService(accessToken);
  }

  onDidChangeTreeData?: vscode.Event<Entry | null | undefined> | undefined;
  getTreeItem(element: Entry): vscode.TreeItem {
    const treeItem = new vscode.TreeItem(
      element.uri,
      element.type === 'layer'
        ? vscode.TreeItemCollapsibleState.None
        : vscode.TreeItemCollapsibleState.Collapsed
    );
    treeItem.label = element.title;
    treeItem.iconPath = vscode.Uri.file(
      path.join(this.extensionPath, 'resources', element.type + '.svg')
    );

    if (element.type === 'layer') {
      // opens layer in inspect mode in browser
      treeItem.command = {
        command: 'vscode.open',
        title: 'Open',
        arguments: [
          vscode.Uri.parse(
            `https://app.goabstract.com/projects/${
              element.obj.projectId
            }/branches/${element.obj.branchId}/commits/${
              element.obj.lastChangedAtSha
            }/files/${element.obj.fileId}/layers/${element.id}?mode=build`
          )
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
    }

    return [];
  }
}
