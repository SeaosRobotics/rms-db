import { Tag, TagFilter, TagUsecase, TagRepository } from './tag_domain';
import logger from '../../tools/logger/logger';

export class TagUsecaseImpl implements TagUsecase {
  constructor(
    private tagRepo: TagRepository,
    private contextTimeout: number,
    private log: typeof logger
  ) {}

  async fetch(ctx: any, filter: TagFilter): Promise<Tag[]> {
    const timeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), this.contextTimeout * 1000)
    );
    
    return Promise.race([
      this.tagRepo.fetch(ctx, filter),
      timeout
    ]) as Promise<Tag[]>;
  }
}

