export interface Location {
  location_id: number;
  client_id: number;
  location_name: string;
  user_id: number;
  updated_at?: Date;
  created_at?: Date;
}

export interface LocationFilter {
  databaseName: string;
  collectionName: string;
  clientId: number;
}

export interface LocationUsecase {
  fetch(ctx: any, filter: LocationFilter): Promise<Location[]>;
  add(ctx: any, filter: LocationFilter, arg: Location): Promise<{ locationId: number; locationName: string }>;
  update(ctx: any, filter: LocationFilter, arg: Location): Promise<{ locationId: number; locationName: string }>;
  delete(ctx: any, filter: LocationFilter, arg: Location): Promise<number>;
}

export interface LocationRepository {
  fetch(ctx: any, filter: LocationFilter): Promise<Location[]>;
  add(ctx: any, filter: LocationFilter, arg: Location): Promise<{ locationId: number; locationName: string }>;
  update(ctx: any, filter: LocationFilter, arg: Location): Promise<{ locationId: number; locationName: string }>;
  delete(ctx: any, filter: LocationFilter, arg: Location): Promise<number>;
}

