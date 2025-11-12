import { Sector, SectorFilter, SectorUsecase, SectorRepository } from './sector_domain';
import logger from '../../tools/logger/logger';

export class SectorUsecaseImpl implements SectorUsecase {
  constructor(
    private sectorRepo: SectorRepository,
    private contextTimeout: number,
    private log: typeof logger
  ) {}

  async fetch(ctx: any, filter: SectorFilter): Promise<Sector[]> {
    const timeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), this.contextTimeout * 1000)
    );
    
    return Promise.race([
      this.sectorRepo.fetch(ctx, filter),
      timeout
    ]) as Promise<Sector[]>;
  }

  async fetchOne(ctx: any, filter: SectorFilter): Promise<Sector | null> {
    const timeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), this.contextTimeout * 1000)
    );
    
    return Promise.race([
      this.sectorRepo.fetchOne(ctx, filter),
      timeout
    ]) as Promise<Sector | null>;
  }

  async add(ctx: any, filter: SectorFilter, arg: Sector): Promise<{ sectorId: number; sectorName: string }> {
    return this.sectorRepo.add(ctx, filter, arg);
  }

  async update(ctx: any, filter: SectorFilter, arg: Sector): Promise<{ sectorId: number; sectorName: string }> {
    return this.sectorRepo.update(ctx, filter, arg);
  }

  async delete(ctx: any, filter: SectorFilter, arg: Sector): Promise<{ sectorId: number; sectorName: string }> {
    return this.sectorRepo.delete(ctx, filter, arg);
  }
}

