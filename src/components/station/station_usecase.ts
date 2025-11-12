import { Station, StationFilter, StationUsecase, StationRepository } from './station_domain';
import logger from '../../tools/logger/logger';

export class StationUsecaseImpl implements StationUsecase {
  constructor(
    private stationRepo: StationRepository,
    private contextTimeout: number,
    private log: typeof logger
  ) {}

  async fetch(ctx: any, filter: StationFilter): Promise<Station[]> {
    const timeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), this.contextTimeout * 1000)
    );
    
    return Promise.race([
      this.stationRepo.fetch(ctx, filter),
      timeout
    ]) as Promise<Station[]>;
  }

  async fetchOne(ctx: any, filter: StationFilter): Promise<Station | null> {
    const timeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), this.contextTimeout * 1000)
    );
    
    return Promise.race([
      this.stationRepo.fetchOne(ctx, filter),
      timeout
    ]) as Promise<Station | null>;
  }

  async add(ctx: any, filter: StationFilter, station: Station): Promise<number> {
    return this.stationRepo.add(ctx, filter, station);
  }

  async update(ctx: any, filter: StationFilter, station: Station): Promise<void> {
    return this.stationRepo.update(ctx, filter, station);
  }

  async delete(ctx: any, filter: StationFilter, station: Station): Promise<void> {
    return this.stationRepo.delete(ctx, filter, station);
  }
}

