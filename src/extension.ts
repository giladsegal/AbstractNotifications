'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {showAbstractFeedTree} from './AbstractFeedTree';
import {FeedProvider} from './FeedProvider';
import {registerCommands} from './commands';
import {GlobalStateManager} from './globalState';
import {
  showAccessTokenInputBox,
  showMissingTokenError,
  showProjectChangedWarning
} from './messages';

let treeDataProvider: FeedProvider;
let disposables: vscode.Disposable[] = [];

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {

  // retrieve existing api key
  let globalState = GlobalStateManager(context.globalState);

  disposables = registerCommands(vscode.commands.registerCommand, globalState);

  let accessToken = globalState.getAccessToken();

  if (!accessToken) {
    // request user to enter his API key
    accessToken = await showAccessTokenInputBox();

    // user canceled the input box
    if (accessToken) {
      await globalState.setAccessToken(accessToken);
      // save the user input into the global state
    } else {
      showMissingTokenError();
      return;
    }
  }

  treeDataProvider = showAbstractFeedTree(context, accessToken!);
  treeDataProvider.beginUpdating();

  treeDataProvider.onProjectChanged(({projectName}) => {
    showProjectChangedWarning(projectName);
  });
}

// this method is called when your extension is deactivated
export function deactivate() {
  treeDataProvider.stopUpdating();
  disposables.forEach(disposable => disposable.dispose());
}
