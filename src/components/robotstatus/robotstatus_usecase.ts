import { RobotStatus, RobotStatusFilter, RobotStatusUsecase, RobotStatusRepository } from './robotstatus_domain';
import logger from '../../tools/logger/logger';

export class RobotStatusUsecaseImpl implements RobotStatusUsecase {
  constructor(
    private robotStatusRepo: RobotStatusRepository,
    private contextTimeout: number,
    private log: typeof logger
  ) {}

  async fetch(ctx: any, filter: RobotStatusFilter): Promise<RobotStatus[]> {
    const timeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), this.contextTimeout * 1000)
    );
    
    return Promise.race([
      this.robotStatusRepo.fetch(ctx, filter),
      timeout
    ]) as Promise<RobotStatus[]>;
  }

  async add(ctx: any, filter: RobotStatusFilter, arg: RobotStatus): Promise<number> {
    return this.robotStatusRepo.add(ctx, filter, arg);
  }
}

