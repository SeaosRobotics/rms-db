import { MongoClient } from 'mongodb';
import { Location, LocationFilter, LocationRepository } from './location_domain';
import { getSeqNoAsync } from '../../tools/mongodb/mongolib';
import logger from '../../tools/logger/logger';

export class LocationRepositoryImpl implements LocationRepository {
  constructor(
    private conn: MongoClient,
    private log: typeof logger
  ) {}

  async fetch(ctx: any, filter: LocationFilter): Promise<Location[]> {
    const results: Location[] = [];
    const collection = this.conn.db(filter.databaseName).collection(filter.collectionName);
    
    const findFilter: any = {};
    const cursor = collection.find(findFilter);
    
    for await (const doc of cursor) {
      results.push({
        location_id: doc.location_id,
        client_id: doc.client_id,
        location_name: doc.location_name,
        user_id: doc.user_id,
        updated_at: doc.updated_at,
        created_at: doc.created_at,
      });
    }
    
    return results;
  }

  async add(ctx: any, filter: LocationFilter, arg: Location): Promise<{ locationId: number; locationName: string }> {
    const collection = this.conn.db(filter.databaseName).collection(filter.collectionName);
    const db = this.conn.db(filter.databaseName);
    
    arg.created_at = new Date();
    arg.updated_at = new Date();
    arg.location_id = await getSeqNoAsync(db, 'seq_location_id');
    
    await collection.insertOne(arg);
    
    return { locationId: arg.location_id, locationName: arg.location_name };
  }

  async update(ctx: any, filter: LocationFilter, arg: Location): Promise<{ locationId: number; locationName: string }> {
    const collection = this.conn.db(filter.databaseName).collection(filter.collectionName);
    
    arg.updated_at = new Date();
    
    const updateFilter = { location_id: arg.location_id };
    const update = { $set: arg };
    
    await collection.updateOne(updateFilter, update);
    
    return { locationId: arg.location_id, locationName: arg.location_name };
  }

  async delete(ctx: any, filter: LocationFilter, arg: Location): Promise<number> {
    const collection = this.conn.db(filter.databaseName).collection(filter.collectionName);
    
    const deleteFilter = { location_id: arg.location_id };
    await collection.deleteOne(deleteFilter);
    
    return arg.location_id;
  }
}

