import * as vscode from 'vscode';
import {FeedProvider, Entry} from './FeedProvider';

export function showAbstractFeedTree(
  context: vscode.ExtensionContext,
  accessToken: string
) {
  const treeDataProvider = new FeedProvider(context, accessToken);

  vscode.window.createTreeView('abstractFeed', {
    treeDataProvider
  });

  return treeDataProvider;
}
