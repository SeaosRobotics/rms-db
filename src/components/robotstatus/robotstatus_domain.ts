import { Pose } from '../pose/pose_domain';

export interface RobotStatus {
  robot_status_id: number;
  location_id: number;
  sector_id: number;
  robot_id: number;
  robot_name: string;
  robot_type: string;
  robot_status_date: number;
  robot_status_pose: Pose;
  loop_closure: string;
  battery_level: string;
  collision_count: string;
  moving_distance: string;
  create_user: string;
  create_date: number;
  update_user: string;
  update_date: number;
  update_count: number;
}

export interface RobotStatusFilter {
  databaseName: string;
  collectionName: string;
  locationId: number;
  sectorId: number;
  robotId: number;
  filterFromDate: number;
  filterToDate: number;
  fetchOffset: number;
  fetchLimit: number;
  filterType: number;
  sortType: number;
  orderType: number;
}

export interface RobotStatusUsecase {
  fetch(ctx: any, filter: RobotStatusFilter): Promise<RobotStatus[]>;
  add(ctx: any, filter: RobotStatusFilter, arg: RobotStatus): Promise<number>;
}

export interface RobotStatusRepository {
  fetch(ctx: any, filter: RobotStatusFilter): Promise<RobotStatus[]>;
  add(ctx: any, filter: RobotStatusFilter, arg: RobotStatus): Promise<number>;
}

