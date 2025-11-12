import { Area, AreaFilter, AreaUsecase, AreaRepository } from './area_domain';
import logger from '../../tools/logger/logger';

export class AreaUsecaseImpl implements AreaUsecase {
  constructor(
    private areaRepo: AreaRepository,
    private contextTimeout: number,
    private log: typeof logger
  ) {}

  async fetch(ctx: any, filter: AreaFilter): Promise<Area[]> {
    const timeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), this.contextTimeout * 1000)
    );
    
    return Promise.race([
      this.areaRepo.fetch(ctx, filter),
      timeout
    ]) as Promise<Area[]>;
  }
}

