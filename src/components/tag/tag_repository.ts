import { MongoClient } from 'mongodb';
import { Tag, TagFilter, TagRepository } from './tag_domain';
import logger from '../../tools/logger/logger';

export class TagRepositoryImpl implements TagRepository {
  constructor(
    private conn: MongoClient,
    private log: typeof logger
  ) {}

  async fetch(ctx: any, filter: TagFilter): Promise<Tag[]> {
    const results: Tag[] = [];
    const collection = this.conn.db(filter.databaseName).collection(filter.collectionName);
    
    let findFilter: any = {};
    
    if (filter.sectorId > 0 && filter.locationId > 0) {
      if (filter.tagId > 0) {
        findFilter = {
          sector_id: filter.sectorId,
          location_id: filter.locationId,
          tag_id: filter.tagId,
        };
      } else {
        findFilter = {
          sector_id: filter.sectorId,
          location_id: filter.locationId,
        };
      }
    }
    
    const cursor = collection.find(findFilter);
    
    for await (const doc of cursor) {
      results.push({
        tag_id: doc.tag_id,
        location_id: doc.location_id,
        sector_id: doc.sector_id,
        tag_name: doc.tag_name,
        tag_group: doc.tag_group,
        tag_no: doc.tag_no,
        turn_dir: doc.turn_dir,
        turn_angle: doc.turn_angle,
        turn_dist: doc.turn_dist,
        turn_init: doc.turn_init,
        radius: doc.radius,
        user_id: doc.user_id,
        updated_at: doc.updated_at,
        created_at: doc.created_at,
      });
    }
    
    return results;
  }
}

