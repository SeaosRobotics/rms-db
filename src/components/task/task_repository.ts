import { MongoClient } from 'mongodb';
import { Task, TaskFilter, TaskRepository } from './task_domain';
import logger from '../../tools/logger/logger';

export class TaskRepositoryImpl implements TaskRepository {
  constructor(
    private conn: MongoClient,
    private log: typeof logger
  ) {}

  async fetch(ctx: any, filter: TaskFilter): Promise<Task[]> {
    const results: Task[] = [];
    const collection = this.conn.db(filter.databaseName).collection(filter.collectionName);
    
    const findFilter: any = {};
    const cursor = collection.find(findFilter);
    
    for await (const doc of cursor) {
      results.push({
        id: doc.id,
        name: doc.name,
        type: doc.type,
      });
    }
    
    return results;
  }

  async fetchOne(ctx: any, filter: TaskFilter): Promise<Task | null> {
    const collection = this.conn.db(filter.databaseName).collection(filter.collectionName);
    
    let findFilter: any = {};
    
    if (filter.id > 0) {
      findFilter = { id: filter.id };
    } else if (filter.name) {
      findFilter = { name: filter.name };
    } else if (filter.type) {
      findFilter = { type: filter.type };
    }
    
    const result = await collection.findOne(findFilter);
    
    if (!result) {
      return null;
    }
    
    return {
      id: result.id,
      name: result.name,
      type: result.type,
    };
  }
}

