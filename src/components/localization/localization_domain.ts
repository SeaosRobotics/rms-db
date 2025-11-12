import { Pose } from '../pose/pose_domain';

export interface Localization {
  localization_id: number;
  location_id: number;
  sector_id: number;
  robot_id: number;
  robot_name: string;
  robot_type: string;
  localization_date: number;
  localization_pose?: Pose;
  loop_closure: string;
  create_user: string;
  create_date: number;
  update_user: string;
  update_date: number;
  update_count: number;
}

export interface LocalizationFilter {
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

export interface LocalizationUsecase {
  fetch(ctx: any, filter: LocalizationFilter): Promise<Localization[]>;
  add(ctx: any, filter: LocalizationFilter, arg: Localization): Promise<number>;
}

export interface LocalizationRepository {
  fetch(ctx: any, filter: LocalizationFilter): Promise<Localization[]>;
  add(ctx: any, filter: LocalizationFilter, arg: Localization): Promise<number>;
}

