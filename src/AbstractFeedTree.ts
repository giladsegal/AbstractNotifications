import * as vscode from 'vscode';
import {FeedProvider} from './FeedProvider';

export function showAbstractFeedTree(
  context: vscode.ExtensionContext,
  accessToken: string
) {
  const treeDataProvider = new FeedProvider(context, accessToken);

  vscode.window.createTreeView('notiFeed', {
    treeDataProvider
  });

  return treeDataProvider;
}
