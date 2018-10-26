import * as vscode from 'vscode';

const ABSTRACT_TOKEN_KEY = 'abstractApi';

export const GlobalStateManager = (globalState: vscode.Memento) => {
  return {
    setAccessToken: (accessToken: string) => {
      return globalState.update(ABSTRACT_TOKEN_KEY, accessToken);
    },
    getAccessToken: () => {
      return globalState.get<string>(ABSTRACT_TOKEN_KEY);
    }
  };
};
