import { Localization, LocalizationFilter, LocalizationUsecase, LocalizationRepository } from './localization_domain';
import logger from '../../tools/logger/logger';

export class LocalizationUsecaseImpl implements LocalizationUsecase {
  constructor(
    private localizationRepo: LocalizationRepository,
    private contextTimeout: number,
    private log: typeof logger
  ) {}

  async fetch(ctx: any, filter: LocalizationFilter): Promise<Localization[]> {
    const timeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), this.contextTimeout * 1000)
    );
    
    return Promise.race([
      this.localizationRepo.fetch(ctx, filter),
      timeout
    ]) as Promise<Localization[]>;
  }

  async add(ctx: any, filter: LocalizationFilter, arg: Localization): Promise<number> {
    return this.localizationRepo.add(ctx, filter, arg);
  }
}

