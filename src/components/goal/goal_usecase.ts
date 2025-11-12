import { Goal, GoalFilter, GoalUsecase, GoalRepository } from './goal_domain';
import logger from '../../tools/logger/logger';

export class GoalUsecaseImpl implements GoalUsecase {
  constructor(
    private goalRepo: GoalRepository,
    private contextTimeout: number,
    private log: typeof logger
  ) {}

  async fetch(ctx: any, filter: GoalFilter): Promise<Goal[]> {
    const timeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), this.contextTimeout * 1000)
    );
    
    return Promise.race([
      this.goalRepo.fetch(ctx, filter),
      timeout
    ]) as Promise<Goal[]>;
  }
}

