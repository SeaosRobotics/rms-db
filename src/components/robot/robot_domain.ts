export interface Robot {
  robot_id: number;
  location_id: number;
  sector_id: number;
  robot_name: string;
  robot_type: string;
  status: number;
  availableUp: number;
  availableDown: number;
  pose: string;
  battery: string;
  slam: number;
  dock_id: number;
  host: string;
  port: string;
  user_id: number;
  updated_at?: Date;
  created_at?: Date;
}

export interface RobotFilter {
  databaseName: string;
  collectionName: string;
  locationId: number;
  sectorId: number;
}

export interface RobotUsecase {
  fetch(ctx: any, filter: RobotFilter): Promise<Robot[]>;
  update(ctx: any, filter: RobotFilter, robot: Robot): Promise<void>;
  addNewRobot(ctx: any, filter: RobotFilter, robot: Robot): Promise<void>;
  deleteRobot(ctx: any, filter: RobotFilter, robot: Robot): Promise<void>;
}

export interface RobotRepository {
  fetch(ctx: any, filter: RobotFilter): Promise<Robot[]>;
  update(ctx: any, filter: RobotFilter, robot: Robot): Promise<void>;
  addNewRobot(ctx: any, filter: RobotFilter, robot: Robot): Promise<void>;
  deleteRobot(ctx: any, filter: RobotFilter, robot: Robot): Promise<void>;
}

