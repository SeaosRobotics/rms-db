export interface Station {
  id: number;
  location_id: number;
  sector_id: number;
  number: number;
  name: string;
  robot_id: number;
  status: number;
  updated_at?: Date;
  created_at?: Date;
}

export const StationStatus = {
  Empty: 0,
  Reserved: 1,
  Occupied: 2,
};

export interface StationFilter {
  databaseName: string;
  collectionName: string;
  locationId: number;
  sectorId: number;
  id: number;
  filterType: number;
  sortType: number;
  orderType: number;
  offset: number;
  limit: number;
}

export interface StationUsecase {
  fetch(ctx: any, filter: StationFilter): Promise<Station[]>;
  fetchOne(ctx: any, filter: StationFilter): Promise<Station | null>;
  add(ctx: any, filter: StationFilter, station: Station): Promise<number>;
  update(ctx: any, filter: StationFilter, station: Station): Promise<void>;
  delete(ctx: any, filter: StationFilter, station: Station): Promise<void>;
}

export interface StationRepository {
  fetch(ctx: any, filter: StationFilter): Promise<Station[]>;
  fetchOne(ctx: any, filter: StationFilter): Promise<Station | null>;
  add(ctx: any, filter: StationFilter, station: Station): Promise<number>;
  update(ctx: any, filter: StationFilter, station: Station): Promise<void>;
  delete(ctx: any, filter: StationFilter, station: Station): Promise<void>;
}

