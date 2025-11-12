import { MongoClient } from 'mongodb';
import { Sector, SectorFilter, SectorRepository } from './sector_domain';
import { getSectorSeqNo } from '../../tools/mongodb/mongolib';
import logger from '../../tools/logger/logger';

export class SectorRepositoryImpl implements SectorRepository {
  constructor(
    private conn: MongoClient,
    private log: typeof logger
  ) {}

  async fetch(ctx: any, filter: SectorFilter): Promise<Sector[]> {
    const results: Sector[] = [];
    const collection = this.conn.db(filter.databaseName).collection(filter.collectionName);
    
    const findFilter: any = { location_id: filter.locationId };
    const cursor = collection.find(findFilter);
    
    for await (const doc of cursor) {
      results.push({
        sector_id: doc.sector_id,
        sector_name: doc.sector_name,
        location_id: doc.location_id,
        orchestration_bridge: doc.orchestration_bridge,
        map_id: doc.map_id,
        user_id: doc.user_id,
        updated_at: doc.updated_at,
        created_at: doc.created_at,
      });
    }
    
    return results;
  }

  async fetchOne(ctx: any, filter: SectorFilter): Promise<Sector | null> {
    const collection = this.conn.db(filter.databaseName).collection(filter.collectionName);
    
    const findFilter: any = { 
      sector_id: filter.sectorId, 
      location_id: filter.locationId 
    };
    
    const result = await collection.findOne(findFilter);
    
    if (!result) {
      return null;
    }
    
    return {
      sector_id: result.sector_id,
      sector_name: result.sector_name,
      location_id: result.location_id,
      orchestration_bridge: result.orchestration_bridge,
      map_id: result.map_id,
      user_id: result.user_id,
      updated_at: result.updated_at,
      created_at: result.created_at,
    };
  }

  async add(ctx: any, filter: SectorFilter, arg: Sector): Promise<{ sectorId: number; sectorName: string }> {
    const collection = this.conn.db(filter.databaseName).collection(filter.collectionName);
    const db = this.conn.db(filter.databaseName);
    
    arg.sector_id = await getSectorSeqNo(db, arg.location_id);
    arg.created_at = new Date();
    arg.updated_at = new Date();
    
    await collection.insertOne(arg);
    
    return { sectorId: arg.sector_id, sectorName: arg.sector_name };
  }

  async update(ctx: any, filter: SectorFilter, arg: Sector): Promise<{ sectorId: number; sectorName: string }> {
    const collection = this.conn.db(filter.databaseName).collection(filter.collectionName);
    
    arg.updated_at = new Date();
    
    const updateFilter: any = {
      sector_id: arg.sector_id,
      location_id: arg.location_id,
    };
    
    const update: any = { $set: arg };
    delete update.$set.sector_id;
    delete update.$set.location_id;
    delete update.$set.created_at;
    
    const result = await collection.updateOne(updateFilter, update);
    
    if (result.matchedCount === 0) {
      throw new Error('No document found for update');
    }
    
    return { sectorId: arg.sector_id, sectorName: arg.sector_name };
  }

  async delete(ctx: any, filter: SectorFilter, arg: Sector): Promise<{ sectorId: number; sectorName: string }> {
    const collection = this.conn.db(filter.databaseName).collection(filter.collectionName);
    
    const deleteFilter: any = {
      sector_id: arg.sector_id,
      location_id: arg.location_id,
    };
    
    const result = await collection.deleteOne(deleteFilter);
    
    if (result.deletedCount === 0) {
      throw new Error('No document found for deletion');
    }
    
    return { sectorId: arg.sector_id, sectorName: arg.sector_name };
  }
}

