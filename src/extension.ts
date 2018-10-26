'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {showAbstractFeedTree} from './AbstractFeedTree';
import {FeedProvider} from './FeedProvider';
import {registerCommands} from './commands';
import {GlobalStateManager} from './globalState';
import {showAccessTokenInputBox, showMissingTokenError} from './messages';

let treeDataProvider: FeedProvider;
let disposables: vscode.Disposable[] = [];

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "abstract-notifications" is now active!'
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  // let disposable = vscode.commands.registerCommand('extension.sayHello', () => {
  //     // The code you place here will be executed every time your command is executed

  //     // Display a message box to the user
  // });

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
  // context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
  treeDataProvider.stopUpdating();
  disposables.forEach(disposable => disposable.dispose());
}
