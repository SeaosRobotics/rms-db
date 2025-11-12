import { MongoClient } from 'mongodb';
import { Notification, NotificationFilter, NotificationRepository } from './notification_domain';
import { getSeqNoAsync } from '../../tools/mongodb/mongolib';
import logger from '../../tools/logger/logger';

export class NotificationRepositoryImpl implements NotificationRepository {
  constructor(
    private conn: MongoClient,
    private log: typeof logger
  ) {}

  async fetch(ctx: any, filter: NotificationFilter): Promise<Notification[]> {
    const results: Notification[] = [];
    const collection = this.conn.db(filter.databaseName).collection(filter.collectionName);
    
    let findFilter: any = {};
    let orderOption: any = {};
    const findOptions: any = {};
    
    let orderType = 1;
    
    switch (filter.filterType) {
      case 1: // DATE
        if (filter.filterToDate > 0) {
          findFilter = {
            $and: [
              { location_id: filter.locationId },
              { sector_id: filter.sectorId },
              { notification_date: { $gte: filter.filterFromDate } },
              { notification_date: { $lte: filter.filterToDate } },
            ],
          };
        } else {
          findFilter = {
            $and: [
              { location_id: filter.locationId },
              { sector_id: filter.sectorId },
              { notification_date: { $gte: filter.filterFromDate } },
            ],
          };
        }
        break;
      case 2: // UNREAD
        findFilter = {
          $and: [
            { location_id: filter.locationId },
            { sector_id: filter.sectorId },
            { confirm_date: 0 },
          ],
        };
        break;
      default:
        findFilter = {
          $and: [
            { location_id: filter.locationId },
            { sector_id: filter.sectorId },
          ],
        };
        orderOption = { notification_id: 1 };
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
      case 2: // TIME
        orderOption = { notification_date: orderType };
        break;
      default:
        orderOption = { notification_id: 1 };
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
      results.push(doc as unknown as Notification);
    }
    
    return results;
  }

  async add(ctx: any, filter: NotificationFilter, arg: Notification): Promise<number> {
    const collection = this.conn.db(filter.databaseName).collection(filter.collectionName);
    const db = this.conn.db(filter.databaseName);
    
    arg.notification_id = await getSeqNoAsync(db, 'seq_notification_id');
    
    await collection.insertOne(arg);
    
    return arg.notification_id;
  }

  async update(ctx: any, filter: NotificationFilter, arg: Notification): Promise<void> {
    const collection = this.conn.db(filter.databaseName).collection(filter.collectionName);
    
    const findFilter: any = {
      $and: [
        { location_id: filter.locationId },
        { sector_id: filter.sectorId },
        { confirm_date: filter.confirmDate },
      ],
    };
    
    await collection.updateMany(findFilter, {
      $set: { confirm_date: arg.confirm_date },
    });
  }
}

