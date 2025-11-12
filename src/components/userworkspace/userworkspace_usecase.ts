import { UserWorkspace, UserWorkspaceFilter, UserLocation, UserSector, UserWorkspaceUsecase, UserWorkspaceRepository } from './userworkspace_domain';
import logger from '../../tools/logger/logger';

export class UserWorkspaceUsecaseImpl implements UserWorkspaceUsecase {
  constructor(
    private userWorkspaceRepo: UserWorkspaceRepository,
    private contextTimeout: number,
    private log: typeof logger
  ) {}

  async fetch(ctx: any, filter: UserWorkspaceFilter): Promise<UserWorkspace[]> {
    const timeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), this.contextTimeout * 1000)
    );
    
    return Promise.race([
      this.userWorkspaceRepo.fetch(ctx, filter),
      timeout
    ]) as Promise<UserWorkspace[]>;
  }

  async add(ctx: any, filter: UserWorkspaceFilter, arg: UserLocation): Promise<UserWorkspace[]> {
    return this.userWorkspaceRepo.add(ctx, filter, arg);
  }

  async addSector(ctx: any, filter: UserWorkspaceFilter, arg: UserSector): Promise<UserWorkspace[]> {
    return this.userWorkspaceRepo.addSector(ctx, filter, arg);
  }

  async update(ctx: any, filter: UserWorkspaceFilter, arg: UserLocation): Promise<UserWorkspace[]> {
    return this.userWorkspaceRepo.update(ctx, filter, arg);
  }

  async updateSector(ctx: any, filter: UserWorkspaceFilter, arg: UserSector): Promise<UserWorkspace[]> {
    return this.userWorkspaceRepo.updateSector(ctx, filter, arg);
  }

  async delete(ctx: any, filter: UserWorkspaceFilter, arg: UserLocation): Promise<UserWorkspace[]> {
    return this.userWorkspaceRepo.delete(ctx, filter, arg);
  }

  async deleteSector(ctx: any, filter: UserWorkspaceFilter, arg: UserSector): Promise<UserWorkspace[]> {
    return this.userWorkspaceRepo.deleteSector(ctx, filter, arg);
  }
}

