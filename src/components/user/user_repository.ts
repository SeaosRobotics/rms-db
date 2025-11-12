import { MongoClient } from 'mongodb';
import { User, UserFilter, UserRepository } from './user_domain';
import { getSeqNoAsync } from '../../tools/mongodb/mongolib';
import logger from '../../tools/logger/logger';

export class UserRepositoryImpl implements UserRepository {
  constructor(
    private conn: MongoClient,
    private log: typeof logger
  ) {}

  async fetch(ctx: any, filter: UserFilter): Promise<User[]> {
    const results: User[] = [];
    const collection = this.conn.db(filter.databaseName).collection(filter.collectionName);
    
    let findFilter: any = {};
    let orderOption: any = {};
    const findOptions: any = {};
    
    let orderType = 1;
    
    switch (filter.filterType) {
      case 1: // ID
        findFilter = { user_id: filter.userId };
        orderOption = { user_id: 1 };
        break;
      case 2: // NAME
        findFilter = { user_name: filter.userName };
        orderOption = { user_name: 1 };
        break;
    }
    
    if (filter.orderType === 1) {
      orderType = 1;
    } else if (filter.orderType === 2) {
      orderType = -1;
    }
    
    switch (filter.sortType) {
      case 1: // ID
        orderOption = { user_id: orderType };
        break;
      case 2: // NAME
        orderOption = { user_name: orderType };
        break;
    }
    
    findOptions.sort = orderOption;
    
    if (filter.fetchLimit > 0) {
      findOptions.limit = filter.fetchLimit;
    }
    if (filter.fetchOffset > 0) {
      findOptions.skip = filter.fetchOffset;
    }
    
    const cursor = collection.find(findFilter, findOptions);
    
    for await (const doc of cursor) {
      results.push(doc as unknown as User);
    }
    
    return results;
  }

  async add(ctx: any, filter: UserFilter, arg: User): Promise<number> {
    const collection = this.conn.db(filter.databaseName).collection(filter.collectionName);
    const db = this.conn.db(filter.databaseName);
    
    arg.user_id = await getSeqNoAsync(db, 'seq_user_id');
    
    await collection.insertOne(arg);
    
    return arg.user_id;
  }

  async update(ctx: any, filter: UserFilter, arg: User): Promise<void> {
    const collection = this.conn.db(filter.databaseName).collection(filter.collectionName);
    
    const updateFilter: any = { user_id: arg.user_id };
    
    const result = await collection.updateOne(updateFilter, { $set: arg });
    
    if (result.matchedCount === 0) {
      throw new Error(`No user found with ID: ${arg.user_id}`);
    }
  }

  async delete(ctx: any, filter: UserFilter, userId: number): Promise<void> {
    const collection = this.conn.db(filter.databaseName).collection(filter.collectionName);
    
    const deleteFilter: any = { user_id: userId };
    
    const result = await collection.deleteOne(deleteFilter);
    
    if (result.deletedCount === 0) {
      throw new Error(`No user found with ID: ${userId}`);
    }
  }
}

