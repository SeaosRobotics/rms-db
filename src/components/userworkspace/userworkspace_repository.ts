import { MongoClient } from 'mongodb';
import { UserWorkspace, UserWorkspaceFilter, UserLocation, UserSector, UserWorkspaceRepository } from './userworkspace_domain';
import logger from '../../tools/logger/logger';

export class UserWorkspaceRepositoryImpl implements UserWorkspaceRepository {
  constructor(
    private conn: MongoClient,
    private log: typeof logger
  ) {}

  async fetch(ctx: any, filter: UserWorkspaceFilter): Promise<UserWorkspace[]> {
    const results: UserWorkspace[] = [];
    const collection = this.conn.db(filter.databaseName).collection(filter.collectionName);
    
    const findFilter: any = { user_id: filter.userId };
    const cursor = collection.find(findFilter);
    
    for await (const doc of cursor) {
      results.push({
        user_id: doc.user_id,
        user_locations: doc.user_locations || [],
      });
    }
    
    return results;
  }

  async add(ctx: any, filter: UserWorkspaceFilter, arg: UserLocation): Promise<UserWorkspace[]> {
    const collection = this.conn.db(filter.databaseName).collection(filter.collectionName);
    
    const findFilter: any = { user_id: filter.userId };
    const existing = await collection.findOne(findFilter);
    
    if (!existing) {
      const newWorkspace: UserWorkspace = {
        user_id: filter.userId,
        user_locations: [arg],
      };
      await collection.insertOne(newWorkspace);
    } else {
      await collection.updateOne(findFilter, ({
        $push: {
          user_locations: {
            location_id: arg.location_id,
            location_name: arg.location_name,
            user_sectors: arg.user_sectors || [],
          },
        },
      } as any));
    }
    
    return this.fetch(ctx, filter);
  }

  async addSector(ctx: any, filter: UserWorkspaceFilter, arg: UserSector): Promise<UserWorkspace[]> {
    const collection = this.conn.db(filter.databaseName).collection(filter.collectionName);
    
    const findFilter: any = {
      user_id: filter.userId,
      'user_locations.location_id': filter.locationId,
    };
    
    await collection.updateOne(findFilter, ({
      $push: {
        'user_locations.$.user_sectors': {
          sector_id: arg.sector_id,
          sector_name: arg.sector_name,
        },
      },
    } as any));
    
    return this.fetch(ctx, filter);
  }

  async update(ctx: any, filter: UserWorkspaceFilter, arg: UserLocation): Promise<UserWorkspace[]> {
    const collection = this.conn.db(filter.databaseName).collection(filter.collectionName);
    
    const findFilter: any = {
      user_id: filter.userId,
      'user_locations.location_id': arg.location_id,
    };
    
    await collection.updateOne(findFilter, {
      $set: {
        'user_locations.$.location_name': arg.location_name,
        'user_locations.$.user_sectors': arg.user_sectors || [],
      },
    });
    
    return this.fetch(ctx, filter);
  }

  async updateSector(ctx: any, filter: UserWorkspaceFilter, arg: UserSector): Promise<UserWorkspace[]> {
    const collection = this.conn.db(filter.databaseName).collection(filter.collectionName);
    
    const findFilter: any = {
      user_id: filter.userId,
      'user_locations.location_id': filter.locationId,
      'user_locations.user_sectors.sector_id': arg.sector_id,
    };
    
    await collection.updateOne(findFilter, {
      $set: {
        'user_locations.$[loc].user_sectors.$[sec].sector_name': arg.sector_name,
      },
    }, {
      arrayFilters: [
        { 'loc.location_id': filter.locationId },
        { 'sec.sector_id': arg.sector_id },
      ],
    });
    
    return this.fetch(ctx, filter);
  }

  async delete(ctx: any, filter: UserWorkspaceFilter, arg: UserLocation): Promise<UserWorkspace[]> {
    const collection = this.conn.db(filter.databaseName).collection(filter.collectionName);
    
    const findFilter: any = { user_id: filter.userId };
    
    await collection.updateOne(findFilter, ({
      $pull: {
        user_locations: { location_id: arg.location_id },
      },
    } as any));
    
    return this.fetch(ctx, filter);
  }

  async deleteSector(ctx: any, filter: UserWorkspaceFilter, arg: UserSector): Promise<UserWorkspace[]> {
    const collection = this.conn.db(filter.databaseName).collection(filter.collectionName);
    
    const findFilter: any = {
      user_id: filter.userId,
      'user_locations.location_id': filter.locationId,
    };
    
    await collection.updateOne(findFilter, ({
      $pull: {
        'user_locations.$.user_sectors': { sector_id: arg.sector_id },
      },
    } as any));
    
    return this.fetch(ctx, filter);
  }
}

