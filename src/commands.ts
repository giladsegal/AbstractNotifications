import * as vscode from 'vscode';
// import {GlobalStateManager} from './globalState';
import {
  showAccessTokenInputBox,
  showTokenDeletedMessage,
  showTokenSavedMessage
} from './messages';

export type RegisterCommandFn = (
  registerCommand: string,
  callback: (...args: any[]) => any,
  thisArg?: any
) => vscode.Disposable;

let commands: vscode.Disposable[];

export function registerCommands(
  registerCommand: RegisterCommandFn,
  globalState: any
): vscode.Disposable[] {
  if (commands) {
    return commands;
  }

  const commandDisposer1 = registerCommand(
    'notifeed.saveAccessToken',
    async () => {
      const accessToken = await showAccessTokenInputBox();

      if (accessToken) {
        await globalState.setAccessToken(accessToken);
        showTokenSavedMessage();
      }
    }
  );

  const commandDisposer2 = registerCommand(
    'notifeed.deleteAccessToken',
    async () => {
      await globalState.setAccessToken(undefined);
      showTokenDeletedMessage();
    }
  );

  commands = [commandDisposer1, commandDisposer2];
  return commands;
}
