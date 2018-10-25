'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

const ABSTRACT_API_KEY = 'abstractApi';

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
  let abstractApi = context.globalState.get<string>(ABSTRACT_API_KEY);

  if (!abstractApi) {
    // request user to enter his API key
    const abstractApi = await vscode.window.showInputBox({
      prompt: 'Enter API token',
      ignoreFocusOut: true,
      password: true,
      placeHolder: 'Your API token...'
    });

    // user canceled the input box
    if (!abstractApi) {
      vscode.window.showErrorMessage(
        'Cannot use Abstract Notifications without an API token'
      );
      return;
      // save the user input into the global state
    } else {
      context.globalState.update(ABSTRACT_API_KEY, abstractApi);
    }
  }

  vscode.window.showInformationMessage('Hello World!');
  // context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
