import * as vscode from 'vscode';
import {FeedProvider, Entry} from './FeedProvider';

export class AbstractFeedTree {
  private abstractFeedTree: vscode.TreeView<Entry>;

  constructor(context: vscode.ExtensionContext, accessToken: string) {
    const treeDataProvider = new FeedProvider(context, accessToken);
    this.abstractFeedTree = vscode.window.createTreeView('abstractFeed', {
      treeDataProvider
    });

    // possible to do this?
    vscode.commands.registerCommand('abstractExplorer.previewLayer', layer =>
      this.previewLayer(layer)
    );
  }

  private previewLayer(layer: any) {
    // TODO: download layer and show in editor. possible?
    // vscode.window.showTextDocument(...)
  }
}
