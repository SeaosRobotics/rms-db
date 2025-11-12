import { Robot, RobotFilter, RobotUsecase, RobotRepository } from './robot_domain';
import logger from '../../tools/logger/logger';

export class RobotUsecaseImpl implements RobotUsecase {
  constructor(
    private robotRepo: RobotRepository,
    private contextTimeout: number,
    private log: typeof logger
  ) {}

  async fetch(ctx: any, filter: RobotFilter): Promise<Robot[]> {
    const timeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), this.contextTimeout * 1000)
    );
    
    return Promise.race([
      this.robotRepo.fetch(ctx, filter),
      timeout
    ]) as Promise<Robot[]>;
  }

  async update(ctx: any, filter: RobotFilter, robot: Robot): Promise<void> {
    return this.robotRepo.update(ctx, filter, robot);
  }

  async addNewRobot(ctx: any, filter: RobotFilter, robot: Robot): Promise<void> {
    return this.robotRepo.addNewRobot(ctx, filter, robot);
  }

  async deleteRobot(ctx: any, filter: RobotFilter, robot: Robot): Promise<void> {
    return this.robotRepo.deleteRobot(ctx, filter, robot);
  }
}

