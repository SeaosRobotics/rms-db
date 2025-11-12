import { MongoClient } from 'mongodb';
import { Pipe, PipeFilter, PipeRepository } from './pipe_domain';
import logger from '../../tools/logger/logger';

export class PipeRepositoryImpl implements PipeRepository {
  constructor(
    private conn: MongoClient,
    private log: typeof logger
  ) {}

  async fetch(ctx: any, filter: PipeFilter): Promise<Pipe[]> {
    const results: Pipe[] = [];
    const collection = this.conn.db(filter.databaseName).collection(filter.collectionName);
    
    let findFilter: any = {};
    
    if (filter.sectorId > 0) {
      findFilter = {
        location_id: filter.locationId,
        sector_id: filter.sectorId,
      };
    } else if (filter.pipeId > 0) {
      findFilter = { id: filter.pipeId };
    }
    
    const cursor = collection.find(findFilter);
    
    for await (const doc of cursor) {
      results.push({
        id: doc.id,
        sector_id: doc.sector_id,
        location_id: doc.location_id,
        name: doc.name,
        closed: doc.closed,
        path: doc.path || [],
      });
    }
    
    return results;
  }

  async add(ctx: any, filter: PipeFilter, arg: Pipe): Promise<Pipe[]> {
    const collection = this.conn.db(filter.databaseName).collection(filter.collectionName);
    
    await collection.insertOne(arg);
    
    return this.fetch(ctx, filter);
  }

  async update(ctx: any, filter: PipeFilter, arg: Pipe): Promise<Pipe[]> {
    const collection = this.conn.db(filter.databaseName).collection(filter.collectionName);
    
    const updateFilter: any = {
      id: arg.id,
      location_id: arg.location_id,
      sector_id: arg.sector_id,
    };
    
    await collection.updateOne(updateFilter, { $set: arg });
    
    return this.fetch(ctx, filter);
  }

  async delete(ctx: any, filter: PipeFilter, arg: Pipe): Promise<Pipe[]> {
    const collection = this.conn.db(filter.databaseName).collection(filter.collectionName);
    
    const deleteFilter: any = {
      id: arg.id,
      location_id: arg.location_id,
      sector_id: arg.sector_id,
    };
    
    await collection.deleteOne(deleteFilter);
    
    return this.fetch(ctx, filter);
  }
}

