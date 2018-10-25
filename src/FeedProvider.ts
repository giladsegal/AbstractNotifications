import * as vscode from 'vscode';
export interface Entry {
  uri: vscode.Uri;
  id: string;
  title: string;
  type: string;
  obj: any;
}

export class FeedProvider implements vscode.TreeDataProvider<Entry> {
  extensionPath: string;

  constructor(context: vscode.ExtensionContext) {
    this.extensionPath = context.extensionPath;
  }

  onDidChangeTreeData?: vscode.Event<Entry | null | undefined> | undefined;
  getTreeItem(element: Entry): vscode.TreeItem | Thenable<vscode.TreeItem> {
    throw new Error('Method not implemented.');
  }
  async getChildren(
    element?: Entry | undefined
  ): Promise<vscode.ProviderResult<Entry[]>> {
    if (!element) {

  }

  return [];
}
