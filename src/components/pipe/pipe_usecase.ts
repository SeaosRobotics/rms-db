import { Pipe, PipeFilter, PipeUsecase, PipeRepository } from './pipe_domain';
import logger from '../../tools/logger/logger';

export class PipeUsecaseImpl implements PipeUsecase {
  constructor(
    private pipeRepo: PipeRepository,
    private contextTimeout: number,
    private log: typeof logger
  ) {}

  async fetch(ctx: any, filter: PipeFilter): Promise<Pipe[]> {
    const timeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), this.contextTimeout * 1000)
    );
    
    return Promise.race([
      this.pipeRepo.fetch(ctx, filter),
      timeout
    ]) as Promise<Pipe[]>;
  }

  async add(ctx: any, filter: PipeFilter, arg: Pipe): Promise<Pipe[]> {
    return this.pipeRepo.add(ctx, filter, arg);
  }

  async update(ctx: any, filter: PipeFilter, arg: Pipe): Promise<Pipe[]> {
    return this.pipeRepo.update(ctx, filter, arg);
  }

  async delete(ctx: any, filter: PipeFilter, arg: Pipe): Promise<Pipe[]> {
    return this.pipeRepo.delete(ctx, filter, arg);
  }
}

