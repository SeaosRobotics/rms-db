import { MongoClient } from 'mongodb';
import { Job, JobFilter, JobRepository } from './job_domain';
import { getSeqNoAsync } from '../../tools/mongodb/mongolib';
import logger from '../../tools/logger/logger';

export class JobRepositoryImpl implements JobRepository {
  constructor(
    private conn: MongoClient,
    private log: typeof logger
  ) {}

  async fetch(ctx: any, filter: JobFilter): Promise<Job[]> {
    const results: Job[] = [];
    const collection = this.conn.db(filter.databaseName).collection(filter.collectionName);
    
    let findFilter: any = {};
    let orderOption: any = {};
    const findOptions: any = {};
    
    let orderType = 1;
    
    switch (filter.filterType) {
      case 1: // ACTIVE
        findFilter = {
          $and: [
            { location_id: filter.locationId },
            { sector_id: filter.sectorId },
            { job_status: { $lt: 3, $gt: -3 } },
          ],
        };
        orderOption = { job_id: 1 };
        break;
      case 2: // NEXT
        findFilter = {
          $and: [
            { location_id: filter.locationId },
            { sector_id: filter.sectorId },
            { job_status: filter.jobStatus },
          ],
        };
        orderOption = { job_order: 1 };
        break;
      case 3: // ID
        findFilter = { $and: [{ job_id: filter.jobId }] };
        orderOption = { job_id: 1 };
        break;
      case 4: // UNIT
        findFilter = {
          $and: [
            { location_id: filter.locationId },
            { sector_id: filter.sectorId },
            { robot_id: filter.robotId },
            { job_status: filter.jobStatus },
          ],
        };
        orderOption = { job_id: 1 };
        break;
      case 5: // DATE
        if (filter.jobFinished > 0) {
          findFilter = {
            $and: [
              { location_id: filter.locationId },
              { sector_id: filter.sectorId },
              {
                $or: [
                  { job_status: { $lt: 0 } },
                  { job_status: { $gt: 2 } },
                ],
              },
              { job_started: { $gte: filter.jobStarted } },
              { job_finished: { $lte: filter.jobFinished } },
            ],
          };
        } else {
          findFilter = {
            $and: [
              { location_id: filter.locationId },
              { sector_id: filter.sectorId },
              {
                $or: [
                  { job_status: { $lt: 0 } },
                  { job_status: { $gt: 2 } },
                ],
              },
              { job_started: { $gte: filter.jobStarted } },
            ],
          };
        }
        break;
      default:
        findFilter = {
          location_id: filter.locationId,
          sector_id: filter.sectorId,
        };
        orderOption = { job_id: 1 };
    }
    
    if (filter.orderType === 1) {
      orderType = 1;
    } else if (filter.orderType === 2) {
      orderType = -1;
    }
    
    switch (filter.sortType) {
      case 1: // UNIT
        orderOption = { robot_id: orderType };
        break;
      case 2: // JOB
        orderOption = { job_id: orderType };
        break;
      case 3: // USER
        orderOption = { create_user: orderType };
        break;
      case 4: // TIME
        orderOption = { job_started: orderType };
        break;
      case 5: // MEMO
        orderOption = { job_message: orderType };
        break;
      default:
        orderOption = { job_id: 1 };
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
      results.push(doc as unknown as Job);
    }
    
    return results;
  }

  async add(ctx: any, filter: JobFilter, arg: Job): Promise<number> {
    const collection = this.conn.db(filter.databaseName).collection(filter.collectionName);
    const db = this.conn.db(filter.databaseName);
    
    arg.job_id = await getSeqNoAsync(db, 'seq_job_id');
    
    await collection.insertOne(arg);
    
    return arg.job_id;
  }

  async update(ctx: any, filter: JobFilter, arg: Job): Promise<void> {
    const collection = this.conn.db(filter.databaseName).collection(filter.collectionName);
    
    const updateFilter: any = { job_id: arg.job_id };
    
    await collection.updateOne(updateFilter, { $set: arg });
  }

  async delete(ctx: any, filter: JobFilter, jobId: number): Promise<void> {
    const collection = this.conn.db(filter.databaseName).collection(filter.collectionName);
    
    const deleteFilter: any = { job_id: jobId };
    
    await collection.deleteOne(deleteFilter);
  }
}

