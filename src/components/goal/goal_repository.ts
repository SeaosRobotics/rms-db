import { MongoClient } from 'mongodb';
import { Goal, GoalFilter, GoalRepository } from './goal_domain';
import logger from '../../tools/logger/logger';

export class GoalRepositoryImpl implements GoalRepository {
  constructor(
    private conn: MongoClient,
    private log: typeof logger
  ) {}

  async fetch(ctx: any, filter: GoalFilter): Promise<Goal[]> {
    const results: Goal[] = [];
    const collection = this.conn.db(filter.databaseName).collection(filter.collectionName);
    
    let findFilter: any = {};
    
    if (filter.sectorId > 0 && filter.locationId > 0) {
      if (filter.goalId > 0) {
        findFilter = {
          goal_id: filter.goalId,
          location_id: filter.locationId,
          sector_id: filter.sectorId,
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
        goal_id: doc.goal_id,
        goal_name: doc.goal_name,
        pose: doc.pose ? {
          position: doc.pose.position,
          orientation: doc.pose.orientation,
        } : undefined,
      });
    }
    
    return results;
  }
}

