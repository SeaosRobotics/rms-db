import { MJob, MJobFilter, MJobUsecase, MJobRepository } from './mjob_domain';
import logger from '../../tools/logger/logger';

export class MJobUsecaseImpl implements MJobUsecase {
  constructor(
    private mjobRepo: MJobRepository,
    private contextTimeout: number,
    private log: typeof logger
  ) {}

  async fetch(ctx: any, filter: MJobFilter): Promise<MJob[]> {
    const timeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), this.contextTimeout * 1000)
    );
    
    return Promise.race([
      this.mjobRepo.fetch(ctx, filter),
      timeout
    ]) as Promise<MJob[]>;
  }

  async add(ctx: any, filter: MJobFilter, arg: MJob): Promise<MJob> {
    return this.mjobRepo.add(ctx, filter, arg);
  }

  async update(ctx: any, filter: MJobFilter, arg: MJob): Promise<MJob> {
    return this.mjobRepo.update(ctx, filter, arg);
  }

  async delete(ctx: any, filter: MJobFilter, arg: MJob): Promise<number> {
    return this.mjobRepo.delete(ctx, filter, arg);
  }
}

