import { Task, TaskFilter, TaskUsecase, TaskRepository } from './task_domain';
import logger from '../../tools/logger/logger';

export class TaskUsecaseImpl implements TaskUsecase {
  constructor(
    private taskRepo: TaskRepository,
    private contextTimeout: number,
    private log: typeof logger
  ) {}

  async fetch(ctx: any, filter: TaskFilter): Promise<Task[]> {
    const timeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), this.contextTimeout * 1000)
    );
    
    return Promise.race([
      this.taskRepo.fetch(ctx, filter),
      timeout
    ]) as Promise<Task[]>;
  }

  async fetchOne(ctx: any, filter: TaskFilter): Promise<Task | null> {
    const timeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), this.contextTimeout * 1000)
    );
    
    return Promise.race([
      this.taskRepo.fetchOne(ctx, filter),
      timeout
    ]) as Promise<Task | null>;
  }
}

