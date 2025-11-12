import { CustomLog, CustomLogFilter, CustomLogUsecase, CustomLogRepository } from './customlog_domain';
import logger from '../../tools/logger/logger';

export class CustomLogUsecaseImpl implements CustomLogUsecase {
  constructor(
    private customLogRepo: CustomLogRepository,
    private contextTimeout: number,
    private log: typeof logger
  ) {}

  async fetch(ctx: any, filter: CustomLogFilter): Promise<CustomLog[]> {
    const timeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), this.contextTimeout * 1000)
    );
    
    return Promise.race([
      this.customLogRepo.fetch(ctx, filter),
      timeout
    ]) as Promise<CustomLog[]>;
  }

  async add(ctx: any, filter: CustomLogFilter, arg: CustomLog): Promise<number> {
    return this.customLogRepo.add(ctx, filter, arg);
  }
}

