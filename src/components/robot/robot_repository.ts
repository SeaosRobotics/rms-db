import { MongoClient } from 'mongodb';
import { Robot, RobotFilter, RobotRepository } from './robot_domain';
import logger from '../../tools/logger/logger';

export class RobotRepositoryImpl implements RobotRepository {
  constructor(
    private conn: MongoClient,
    private log: typeof logger
  ) {}

  async fetch(ctx: any, filter: RobotFilter): Promise<Robot[]> {
    const results: Robot[] = [];
    const collection = this.conn.db(filter.databaseName).collection(filter.collectionName);
    
    const findFilter: any = {
      location_id: filter.locationId,
      sector_id: filter.sectorId,
    };
    
    const cursor = collection.find(findFilter);
    
    for await (const doc of cursor) {
      results.push({
        robot_id: doc.robot_id,
        location_id: doc.location_id,
        sector_id: doc.sector_id,
        robot_name: doc.robot_name,
        robot_type: doc.robot_type,
        status: doc.status,
        availableUp: doc.availableUp,
        availableDown: doc.availableDown,
        pose: doc.pose,
        battery: doc.battery,
        slam: doc.slam,
        dock_id: doc.dock_id,
        host: doc.host,
        port: doc.port,
        user_id: doc.user_id,
        updated_at: doc.updated_at,
        created_at: doc.created_at,
      });
    }
    
    return results;
  }

  async update(ctx: any, filter: RobotFilter, robot: Robot): Promise<void> {
    const collection = this.conn.db(filter.databaseName).collection(filter.collectionName);
    
    robot.updated_at = new Date();
    
    const findFilter: any = {
      robot_id: robot.robot_id,
      location_id: robot.location_id,
      sector_id: robot.sector_id,
    };
    
    // Check if robot exists
    const existing = await collection.findOne(findFilter);
    
    if (!existing) {
      // Try to insert instead
      robot.created_at = new Date();
      await collection.insertOne(robot);
      this.log.info(`Robot created: ${robot.robot_id}`);
      return;
    }
    
    const update: any = {
      $set: {
        robot_name: robot.robot_name,
        robot_type: robot.robot_type,
        status: robot.status,
        availableUp: robot.availableUp,
        availableDown: robot.availableDown,
        pose: robot.pose,
        battery: robot.battery,
        slam: robot.slam,
        dock_id: robot.dock_id,
        host: robot.host,
        port: robot.port,
        updated_at: robot.updated_at,
      },
    };
    
    const result = await collection.updateOne(findFilter, update);
    
    if (result.matchedCount === 0) {
      throw new Error('No robot matched the update criteria');
    }
    
    this.log.info(`Robot updated: ${robot.robot_id}`);
  }

  async addNewRobot(ctx: any, filter: RobotFilter, robot: Robot): Promise<void> {
    const collection = this.conn.db(filter.databaseName).collection(filter.collectionName);
    
    robot.created_at = new Date();
    robot.updated_at = new Date();
    
    await collection.insertOne(robot);
    this.log.info(`Robot added: ${robot.robot_id}`);
  }

  async deleteRobot(ctx: any, filter: RobotFilter, robot: Robot): Promise<void> {
    const collection = this.conn.db(filter.databaseName).collection(filter.collectionName);
    
    const deleteFilter: any = { robot_id: robot.robot_id };
    
    const result = await collection.deleteOne(deleteFilter);
    
    if (result.deletedCount === 0) {
      throw new Error('Robot not found for deletion');
    }
    
    this.log.info(`Robot deleted: ${robot.robot_id}`);
  }
}

