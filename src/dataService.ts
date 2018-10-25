import * as Abstract from 'abstract-sdk';

export class DataService {
  abstract: Abstract.AbstractClient;

  constructor(accessToken: string) {
    this.abstract = Abstract.Client({
      accessToken,
      transport: Abstract.TRANSPORTS.API
    });
  }

  getAllProjects = (): Promise<Abstract.Project[]> => {
    return this.abstract.projects.list();
  };

  getProject = (
    projects: Abstract.Project[],
    {name}: {name: string}
  ): Abstract.Project | undefined => {
    return projects.find(project => project.name === name);
  };

  getBranch = ({
    projectId,
    branchId
  }: Abstract.BranchDescriptor): Promise<Abstract.Branch> => {
    return this.abstract.branches.info({
      projectId,
      branchId
    });
  };

  getCommits = ({
    projectId,
    branchId
  }: Abstract.CommitDescriptor): Promise<Abstract.Commit[]> => {
    return this.abstract.commits.list({
      projectId,
      branchId
    });
  };
}
