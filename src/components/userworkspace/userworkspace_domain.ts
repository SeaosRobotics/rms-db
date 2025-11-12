export interface UserWorkspace {
  user_id: number;
  user_locations: UserLocation[];
}

export interface UserLocation {
  location_id: number;
  location_name: string;
  user_sectors: UserSector[];
}

export interface UserSector {
  sector_id: number;
  sector_name: string;
}

export interface UserWorkspaceFilter {
  databaseName: string;
  collectionName: string;
  userId: number;
  locationId: number;
}

export interface UserWorkspaceUsecase {
  fetch(ctx: any, filter: UserWorkspaceFilter): Promise<UserWorkspace[]>;
  add(ctx: any, filter: UserWorkspaceFilter, arg: UserLocation): Promise<UserWorkspace[]>;
  addSector(ctx: any, filter: UserWorkspaceFilter, arg: UserSector): Promise<UserWorkspace[]>;
  update(ctx: any, filter: UserWorkspaceFilter, arg: UserLocation): Promise<UserWorkspace[]>;
  updateSector(ctx: any, filter: UserWorkspaceFilter, arg: UserSector): Promise<UserWorkspace[]>;
  delete(ctx: any, filter: UserWorkspaceFilter, arg: UserLocation): Promise<UserWorkspace[]>;
  deleteSector(ctx: any, filter: UserWorkspaceFilter, arg: UserSector): Promise<UserWorkspace[]>;
}

export interface UserWorkspaceRepository {
  fetch(ctx: any, filter: UserWorkspaceFilter): Promise<UserWorkspace[]>;
  add(ctx: any, filter: UserWorkspaceFilter, arg: UserLocation): Promise<UserWorkspace[]>;
  addSector(ctx: any, filter: UserWorkspaceFilter, arg: UserSector): Promise<UserWorkspace[]>;
  update(ctx: any, filter: UserWorkspaceFilter, arg: UserLocation): Promise<UserWorkspace[]>;
  updateSector(ctx: any, filter: UserWorkspaceFilter, arg: UserSector): Promise<UserWorkspace[]>;
  delete(ctx: any, filter: UserWorkspaceFilter, arg: UserLocation): Promise<UserWorkspace[]>;
  deleteSector(ctx: any, filter: UserWorkspaceFilter, arg: UserSector): Promise<UserWorkspace[]>;
}

