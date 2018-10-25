declare module 'abstract-sdk' {
  namespace AbstractSdk {
    export enum TRANSPORTS {
      API,
      CLI
    }
    export function Client(params: {
      accessToken: string;
      transport: TRANSPORTS;
    }): any;

    export type AbstractClient = {
      branches: {
        list: (
          description: ProjectDescriptor,
          filter: {filter?: 'active' | 'archived' | 'mine'}
        ) => Promise<Branch[]>;

        info: (descripiton: BranchDescriptor) => Promise<Branch>;
      };

      commits: {
        list: (descriptor: BranchDescriptor) => Promise<Commit[]>;
        info(descriptor: CommitDescriptor): Promise<Commit>;
      };

      projects: {
        list: (descriptor?: string) => Promise<Project[]>;
      };
    };

    export type Branch = {
      createdAt: string;
      description: string;
      divergedFromBranchId: string;
      head: string;
      id: string;
      mergeSha: string;
      mergedIntoBranchId: string;
      name: string;
      parent: string;
      projectId: string;
      startedAtSha: string;
      status: BranchStatus;
      updatedAt: string;
      userId: string;
      userName: string;
    };

    export type BranchStatus =
      | 'active'
      | 'wip'
      | 'feedback'
      | 'review'
      | 'merged'
      | 'archived'
      | 'deleted'
      | 'diverged';

    export type Commit = {
      description: string;
      destinationBranchId: string;
      destinationBranchName: string;
      fileIds: string[];
      parents: string[];
      projectId: string;
      sha: string;
      sourceBranchId: string;
      sourceBranchName: string;
      time: string;
      title: string;
      type: CommitType;
      userId: string;
      userName: string;
    };

    export type CommitType =
      | 'NORMAL'
      | 'PROJECT_CREATED'
      | 'FILE_ADDED'
      | 'FILE_RENAMED'
      | 'FILE_DELETED'
      | 'FILE_REPLACED'
      | 'LIBRARY_ADDED'
      | 'LIBRARY_REMOVED'
      | 'RESTORE'
      | 'UPDATE'
      | 'MERGE';

    export type Project = {
      about: string;
      archivedAt: string;
      color: string;
      createdAt: string;
      createdByUser: any;
      description: string;
      firstPushedAt: string;
      id: string;
      name: string;
      organizationId: string;
      pushedAt: string;
      repoCreatedAt: string;
      sizeInBytes: number;
      updatedAt: string;
      visibility: 'organization' | 'specific';
    };

    export type ProjectDescriptor = {
      projectId: string;
    };

    export type BranchDescriptor = {
      projectId: string;
      branchId: string;
    };

    export type CommitDescriptor = {
      projectId: string;
      branchId: string | 'master';
      sha?: string;
    };
  }

  export = AbstractSdk;
}

/*
export = WixEventually;

declare function WixEventually(fn: Function, opts?: WixEventually.Opts): Promise<void>;

declare namespace WixEventually {
  export interface Opts {
    timeout?: number;
    interval?: number;
  }

  function _with(overrides: Opts): (fn: Function, opts?: WixEventually.Opts) => Promise<void>;
  export { _with as with }
}
*/
