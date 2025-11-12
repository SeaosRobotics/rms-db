import { MongoClient } from 'mongodb';
import { Map, MapFilter, MapRepository } from './map_domain';
import { getMapSeqNo } from '../../tools/mongodb/mongolib';
import logger from '../../tools/logger/logger';

export class MapRepositoryImpl implements MapRepository {
  constructor(
    private conn: MongoClient,
    private log: typeof logger
  ) {}

  async fetch(ctx: any, filter: MapFilter): Promise<Map[]> {
    const results: Map[] = [];
    const collection = this.conn.db(filter.databaseName).collection(filter.collectionName);
    
    const findFilter: any = {
      map_id: filter.mapId,
      location_id: filter.locationId,
      sector_id: filter.sectorId,
    };
    
    const cursor = collection.find(findFilter);
    
    for await (const doc of cursor) {
      results.push({
        location_id: doc.location_id,
        sector_id: doc.sector_id,
        map_id: doc.map_id,
        map_name: doc.map_name,
        map_location: doc.map_location,
        style_name: doc.style_name,
        style_value: doc.style_value,
        meta: doc.meta,
        image: doc.image,
        ratio: doc.ratio,
        user_id: doc.user_id,
        updated_at: doc.updated_at,
        created_at: doc.created_at,
      });
    }
    
    return results;
  }

  async getMap(ctx: any, filter: MapFilter): Promise<Map | null> {
    const collection = this.conn.db(filter.databaseName).collection(filter.collectionName);
    
    const findFilter: any = {
      location_id: filter.locationId,
      sector_id: filter.sectorId,
    };
    
    const result = await collection.findOne(findFilter);
    
    if (!result) {
      return null;
    }
    
    return {
      location_id: result.location_id,
      sector_id: result.sector_id,
      map_id: result.map_id,
      map_name: result.map_name,
      map_location: result.map_location,
      style_name: result.style_name,
      style_value: result.style_value,
      meta: result.meta,
      image: result.image,
      ratio: result.ratio,
      user_id: result.user_id,
      updated_at: result.updated_at,
      created_at: result.created_at,
    };
  }

  async add(ctx: any, filter: MapFilter, arg: Map): Promise<Map> {
    const collection = this.conn.db(filter.databaseName).collection(filter.collectionName);
    const db = this.conn.db(filter.databaseName);
    
    if (arg.map_id === 0) {
      arg.map_id = await getMapSeqNo(db, arg.location_id, arg.sector_id);
    }
    
    arg.created_at = new Date();
    arg.updated_at = new Date();
    
    await collection.insertOne(arg);
    
    return arg;
  }

  async update(ctx: any, filter: MapFilter, arg: Map): Promise<Map> {
    const collection = this.conn.db(filter.databaseName).collection(filter.collectionName);
    
    arg.updated_at = new Date();
    
    const updateFilter: any = {
      location_id: filter.locationId,
      sector_id: filter.sectorId,
      map_id: filter.mapId,
    };
    
    await collection.updateOne(updateFilter, { $set: arg });
    
    return arg;
  }

  async delete(ctx: any, filter: MapFilter, arg: Map): Promise<number> {
    const collection = this.conn.db(filter.databaseName).collection(filter.collectionName);
    
    const deleteFilter: any = {
      location_id: filter.locationId,
      sector_id: filter.sectorId,
      map_id: filter.mapId,
    };
    
    await collection.deleteOne(deleteFilter);
    
    return 1;
  }
}

