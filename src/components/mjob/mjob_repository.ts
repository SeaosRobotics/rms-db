import { MongoClient } from 'mongodb';
import { MJob, MJobFilter, MJobRepository } from './mjob_domain';
import { getMJobSeqNo } from '../../tools/mongodb/mongolib';
import logger from '../../tools/logger/logger';

export class MJobRepositoryImpl implements MJobRepository {
  constructor(
    private conn: MongoClient,
    private log: typeof logger
  ) {}

  async fetch(ctx: any, filter: MJobFilter): Promise<MJob[]> {
    const results: MJob[] = [];
    const collection = this.conn.db(filter.databaseName).collection(filter.collectionName);
    
    const findFilter: any = {
      location_id: filter.locationId,
      sector_id: filter.sectorId,
    };
    
    if (filter.jobId > 0) {
      findFilter.job_id = filter.jobId;
    }
    
    const cursor = collection.find(findFilter);
    
    for await (const doc of cursor) {
      results.push(doc as unknown as MJob);
    }
    
    return results;
  }

  async add(ctx: any, filter: MJobFilter, arg: MJob): Promise<MJob> {
    const collection = this.conn.db(filter.databaseName).collection(filter.collectionName);
    const db = this.conn.db(filter.databaseName);
    
    arg.create_date = new Date();
    arg.update_date = new Date();
    
    arg.job_id = await getMJobSeqNo(db, arg.location_id, arg.sector_id);
    
    await collection.insertOne(arg);
    
    return arg;
  }

  async update(ctx: any, filter: MJobFilter, arg: MJob): Promise<MJob> {
    const collection = this.conn.db(filter.databaseName).collection(filter.collectionName);
    
    arg.update_date = new Date();
    
    const updateFilter: any = {
      job_id: arg.job_id,
      location_id: filter.locationId,
      sector_id: filter.sectorId,
    };
    
    await collection.updateOne(updateFilter, { $set: arg });
    
    return arg;
  }

  async delete(ctx: any, filter: MJobFilter, arg: MJob): Promise<number> {
    const collection = this.conn.db(filter.databaseName).collection(filter.collectionName);
    
    const deleteFilter: any = {
      job_id: arg.job_id,
      location_id: filter.locationId,
      sector_id: filter.sectorId,
    };
    
    await collection.deleteOne(deleteFilter);
    
    return 1;
  }
}

