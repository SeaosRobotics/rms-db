import { MongoClient } from 'mongodb';
import { Localization, LocalizationFilter, LocalizationRepository } from './localization_domain';
import { getSeqNoAsync } from '../../tools/mongodb/mongolib';
import logger from '../../tools/logger/logger';

export class LocalizationRepositoryImpl implements LocalizationRepository {
  constructor(
    private conn: MongoClient,
    private log: typeof logger
  ) {}

  async fetch(ctx: any, filter: LocalizationFilter): Promise<Localization[]> {
    const results: Localization[] = [];
    const collection = this.conn.db(filter.databaseName).collection(filter.collectionName);
    
    let findFilter: any = {
      location_id: filter.locationId,
      sector_id: filter.sectorId,
    };
    
    if (filter.filterType === 1 && filter.filterFromDate > 0) {
      if (filter.filterToDate > 0) {
        findFilter.localization_date = {
          $gte: filter.filterFromDate,
          $lte: filter.filterToDate,
        };
      } else {
        findFilter.localization_date = { $gte: filter.filterFromDate };
      }
    }
    
    const findOptions: any = {};
    
    if (filter.fetchLimit > 0) {
      findOptions.limit = filter.fetchLimit;
    }
    if (filter.fetchOffset > 0) {
      findOptions.skip = filter.fetchOffset;
    }
    
    const cursor = collection.find(findFilter, findOptions);
    
    for await (const doc of cursor) {
      results.push(doc as unknown as Localization);
    }
    
    return results;
  }

  async add(ctx: any, filter: LocalizationFilter, arg: Localization): Promise<number> {
    const collection = this.conn.db(filter.databaseName).collection(filter.collectionName);
    const db = this.conn.db(filter.databaseName);
    
    arg.localization_id = await getSeqNoAsync(db, 'seq_localization_id');
    
    await collection.insertOne(arg);
    
    return arg.localization_id;
  }
}

