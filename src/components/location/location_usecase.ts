import { Location, LocationFilter, LocationUsecase, LocationRepository } from './location_domain';
import logger from '../../tools/logger/logger';

export class LocationUsecaseImpl implements LocationUsecase {
  constructor(
    private locationRepo: LocationRepository,
    private contextTimeout: number,
    private log: typeof logger
  ) {}

  async fetch(ctx: any, filter: LocationFilter): Promise<Location[]> {
    const timeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), this.contextTimeout * 1000)
    );
    
    return Promise.race([
      this.locationRepo.fetch(ctx, filter),
      timeout
    ]) as Promise<Location[]>;
  }

  async add(ctx: any, filter: LocationFilter, arg: Location): Promise<{ locationId: number; locationName: string }> {
    return this.locationRepo.add(ctx, filter, arg);
  }

  async update(ctx: any, filter: LocationFilter, arg: Location): Promise<{ locationId: number; locationName: string }> {
    return this.locationRepo.update(ctx, filter, arg);
  }

  async delete(ctx: any, filter: LocationFilter, arg: Location): Promise<number> {
    return this.locationRepo.delete(ctx, filter, arg);
  }
}

