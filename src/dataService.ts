import * as Abstract from 'abstract-sdk';




// async function foo() {
//   const dataService = new DataService(abstract);

//   const projects = await dataService.getAllProjects();
//   //   projects.map(project => {
//   //     console.log(`${project.name}: ${project.id}`);
//   //   });

//   const project = await dataService.getProject(projects, {
//     name: 'Subscriptions'
//   });

//   const branch = await abstract.branches.info({
//     projectId: project.id,
//     branchId: 'master'
//   });

//   const commits = await dataService.getBranch({
//     projectId: project.id,
//     branchId: 'master'
//   });

//   console.log(commits);
// }

export class DataService {
  constructor(private readonly abstract: any) {
    const accessToken =
      '5c444fc40c2a5124a7aab5fcba89dfd7536ce7072cc05e973d8eeedbbc08620b';

    this.abstract = abstract || Abstract.Client({
      accessToken,
      transport: Abstract.TRANSPORTS.API
    });
  }

  getAllProjects = () => {
    return this.abstract.projects.list();
  }

  getProject = (projects: any[], {name}: {name: string}) => {
    return projects.find(project => project.name === name);
  }

  getBranch = ({projectId, branchId}: {projectId: string, branchId: string}) => {
    return this.abstract.branches.info({
      projectId,
      branchId
    });
  }

  getCommits = ({projectId, branchId}: {projectId: string, branchId: string}) => {
    return this.abstract.commits.list({
      projectId,
      branchId
    });
  }
}


//   const commits = await dataService.getBranch({
//     projectId: project.id,
//     branchId: 'master'
//   });