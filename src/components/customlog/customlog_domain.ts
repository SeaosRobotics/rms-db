export interface CustomLog {
  custom_log_id: number;
  location_id: number;
  sector_id: number;
  robot_id: number;
  robot_name: string;
  robot_type: string;
  custom_log_date: number;
  custom_log_type: string;
  custom_log_code: string;
  custom_log_message: string;
  create_user: string;
  create_date: number;
  update_user: string;
  update_date: number;
  update_count: number;
}

export interface CustomLogFilter {
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

export interface CustomLogUsecase {
  fetch(ctx: any, filter: CustomLogFilter): Promise<CustomLog[]>;
  add(ctx: any, filter: CustomLogFilter, arg: CustomLog): Promise<number>;
}

export interface CustomLogRepository {
  fetch(ctx: any, filter: CustomLogFilter): Promise<CustomLog[]>;
  add(ctx: any, filter: CustomLogFilter, arg: CustomLog): Promise<number>;
}

