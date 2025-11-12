import { Map, MapFilter, MapUsecase, MapRepository } from './map_domain';
import logger from '../../tools/logger/logger';

export class MapUsecaseImpl implements MapUsecase {
  constructor(
    private mapRepo: MapRepository,
    private contextTimeout: number,
    private log: typeof logger
  ) {}

  async fetch(ctx: any, filter: MapFilter): Promise<Map[]> {
    const timeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), this.contextTimeout * 1000)
    );
    
    return Promise.race([
      this.mapRepo.fetch(ctx, filter),
      timeout
    ]) as Promise<Map[]>;
  }

  async getMap(ctx: any, filter: MapFilter): Promise<Map | null> {
    const timeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), this.contextTimeout * 1000)
    );
    
    return Promise.race([
      this.mapRepo.getMap(ctx, filter),
      timeout
    ]) as Promise<Map | null>;
  }

  async add(ctx: any, filter: MapFilter, arg: Map): Promise<Map> {
    return this.mapRepo.add(ctx, filter, arg);
  }

  async update(ctx: any, filter: MapFilter, arg: Map): Promise<Map> {
    return this.mapRepo.update(ctx, filter, arg);
  }

  async delete(ctx: any, filter: MapFilter, arg: Map): Promise<number> {
    return this.mapRepo.delete(ctx, filter, arg);
  }
}

