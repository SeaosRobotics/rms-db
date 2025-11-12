import { MongoClient } from 'mongodb';
import { Station, StationFilter, StationRepository } from './station_domain';
import logger from '../../tools/logger/logger';

export class StationRepositoryImpl implements StationRepository {
  constructor(
    private conn: MongoClient,
    private log: typeof logger
  ) {}

  async fetch(ctx: any, filter: StationFilter): Promise<Station[]> {
    const results: Station[] = [];
    const collection = this.conn.db(filter.databaseName).collection(filter.collectionName);
    
    let findFilter: any = {};
    
    if (filter.sectorId > 0 && filter.locationId > 0) {
      findFilter = {
        sector_id: filter.sectorId,
        location_id: filter.locationId,
      };
    } else if (filter.id > 0) {
      findFilter = { id: filter.id };
    }
    
    const findOptions: any = {};
    
    if (filter.limit > 0) {
      findOptions.limit = filter.limit;
      findOptions.skip = filter.offset;
    }
    
    if (filter.sortType > 0) {
      let sortField = '';
      switch (filter.sortType) {
        case 1: // Name
          sortField = 'name';
          break;
        case 2: // Number
          sortField = 'number';
          break;
        case 3: // Status
          sortField = 'status';
          break;
      }
      
      if (sortField) {
        const sortOrder = filter.orderType === 2 ? -1 : 1;
        findOptions.sort = { [sortField]: sortOrder };
      }
    }
    
    const cursor = collection.find(findFilter, findOptions);
    
    for await (const doc of cursor) {
      results.push({
        id: doc.id,
        location_id: doc.location_id,
        sector_id: doc.sector_id,
        number: doc.number,
        name: doc.name,
        robot_id: doc.robot_id,
        status: doc.status,
        updated_at: doc.updated_at,
        created_at: doc.created_at,
      });
    }
    
    return results;
  }

  async fetchOne(ctx: any, filter: StationFilter): Promise<Station | null> {
    const collection = this.conn.db(filter.databaseName).collection(filter.collectionName);
    
    let findFilter: any = {};
    
    if (filter.id > 0) {
      findFilter = { id: filter.id };
    } else if (filter.sectorId > 0 && filter.locationId > 0) {
      findFilter = {
        sector_id: filter.sectorId,
        location_id: filter.locationId,
      };
    }
    
    const result = await collection.findOne(findFilter);
    
    if (!result) {
      return null;
    }
    
    return {
      id: result.id,
      location_id: result.location_id,
      sector_id: result.sector_id,
      number: result.number,
      name: result.name,
      robot_id: result.robot_id,
      status: result.status,
      updated_at: result.updated_at,
      created_at: result.created_at,
    };
  }

  async add(ctx: any, filter: StationFilter, station: Station): Promise<number> {
    const collection = this.conn.db(filter.databaseName).collection(filter.collectionName);
    
    // Get the next ID
    const lastStation = await collection.findOne({}, { sort: { id: -1 } });
    station.id = lastStation ? (lastStation.id as number) + 1 : 1;
    
    station.created_at = new Date();
    station.updated_at = new Date();
    
    await collection.insertOne(station);
    
    return station.id;
  }

  async update(ctx: any, filter: StationFilter, station: Station): Promise<void> {
    const collection = this.conn.db(filter.databaseName).collection(filter.collectionName);
    
    let updateFilter: any = { id: station.id };
    
    if (filter.sectorId > 0 && filter.locationId > 0) {
      updateFilter = {
        id: station.id,
        sector_id: filter.sectorId,
        location_id: filter.locationId,
      };
    }
    
    station.updated_at = new Date();
    
    await collection.updateOne(updateFilter, { $set: station });
  }

  async delete(ctx: any, filter: StationFilter, station: Station): Promise<void> {
    const collection = this.conn.db(filter.databaseName).collection(filter.collectionName);
    
    let deleteFilter: any = { id: station.id };
    
    if (filter.sectorId > 0 && filter.locationId > 0) {
      deleteFilter = {
        id: station.id,
        sector_id: filter.sectorId,
        location_id: filter.locationId,
      };
    }
    
    await collection.deleteOne(deleteFilter);
  }
}

