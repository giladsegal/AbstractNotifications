import * as vscode from 'vscode';

export const showAccessTokenInputBox = () => {
  return vscode.window.showInputBox({
    prompt: 'Enter your Abstract access token',
    ignoreFocusOut: true,
    password: true,
    placeHolder: 'Your access token...'
  });
};

export const showMissingTokenError = () => {
  vscode.window.showErrorMessage(
    'Cannot use Abstract Notifications without an access token'
  );
};

export const showTokenSavedMessage = () => {
  vscode.window.showInformationMessage('Token saved successfully');
};

export const showTokenDeletedMessage = () => {
  vscode.window.showInformationMessage('Token deleted successfully');
};

export const showProjectChangedWarning = (projectName: string) => {
  vscode.window.showWarningMessage(`${projectName} was updated!`);
};
