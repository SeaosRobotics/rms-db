export interface Notification {
  notification_id: number;
  location_id: number;
  sector_id: number;
  robot_id: number;
  robot_name: string;
  robot_type: string;
  notification_date: number;
  notification_type: string;
  notification_code: string;
  notification_message: string;
  confirm_date: number;
  create_user: string;
  create_date: number;
  update_user: string;
  update_date: number;
  update_count: number;
}

export interface NotificationFilter {
  databaseName: string;
  collectionName: string;
  locationId: number;
  sectorId: number;
  robotId: number;
  confirmDate: number;
  filterFromDate: number;
  filterToDate: number;
  fetchOffset: number;
  fetchLimit: number;
  filterType: number;
  sortType: number;
  orderType: number;
}

export interface NotificationUsecase {
  fetch(ctx: any, filter: NotificationFilter): Promise<Notification[]>;
  add(ctx: any, filter: NotificationFilter, arg: Notification): Promise<number>;
  update(ctx: any, filter: NotificationFilter, arg: Notification): Promise<void>;
}

export interface NotificationRepository {
  fetch(ctx: any, filter: NotificationFilter): Promise<Notification[]>;
  add(ctx: any, filter: NotificationFilter, arg: Notification): Promise<number>;
  update(ctx: any, filter: NotificationFilter, arg: Notification): Promise<void>;
}

