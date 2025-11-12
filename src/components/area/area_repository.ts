import { MongoClient } from 'mongodb';
import { Area, AreaFilter, AreaRepository } from './area_domain';
import logger from '../../tools/logger/logger';

export class AreaRepositoryImpl implements AreaRepository {
  constructor(
    private conn: MongoClient,
    private log: typeof logger
  ) {}

  async fetch(ctx: any, filter: AreaFilter): Promise<Area[]> {
    const results: Area[] = [];
    const collection = this.conn.db(filter.databaseName).collection(filter.collectionName);
    
    let findFilter: any = {};
    
    if (filter.sector > 0 && filter.location > 0) {
      if (filter.id > 0) {
        findFilter = {
          id: filter.id,
          location: filter.location,
          sector: filter.sector,
        };
      } else {
        findFilter = {
          location: filter.location,
          sector: filter.sector,
        };
      }
    }
    
    const cursor = collection.find(findFilter);
    
    for await (const doc of cursor) {
      results.push({
        id: doc.id,
        name: doc.name,
        location: doc.location,
        sector: doc.sector,
        polygon: doc.polygon || [],
      });
    }
    
    return results;
  }
}

