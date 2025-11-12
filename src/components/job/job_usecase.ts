import { Job, JobFilter, JobUsecase, JobRepository } from './job_domain';
import logger from '../../tools/logger/logger';

export class JobUsecaseImpl implements JobUsecase {
  constructor(
    private jobRepo: JobRepository,
    private contextTimeout: number,
    private log: typeof logger
  ) {}

  async fetch(ctx: any, filter: JobFilter): Promise<Job[]> {
    const timeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), this.contextTimeout * 1000)
    );
    
    return Promise.race([
      this.jobRepo.fetch(ctx, filter),
      timeout
    ]) as Promise<Job[]>;
  }

  async add(ctx: any, filter: JobFilter, arg: Job): Promise<number> {
    return this.jobRepo.add(ctx, filter, arg);
  }

  async update(ctx: any, filter: JobFilter, arg: Job): Promise<void> {
    return this.jobRepo.update(ctx, filter, arg);
  }

  async delete(ctx: any, filter: JobFilter, jobId: number): Promise<void> {
    return this.jobRepo.delete(ctx, filter, jobId);
  }
}

