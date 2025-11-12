import { Pose } from '../pose/pose_domain';

export interface Goal {
  goal_id: number;
  goal_name: string;
  pose?: Pose;
}

export interface GoalFilter {
  databaseName: string;
  collectionName: string;
  locationId: number;
  sectorId: number;
  goalId: number;
}

export interface GoalUsecase {
  fetch(ctx: any, filter: GoalFilter): Promise<Goal[]>;
}

export interface GoalRepository {
  fetch(ctx: any, filter: GoalFilter): Promise<Goal[]>;
}

