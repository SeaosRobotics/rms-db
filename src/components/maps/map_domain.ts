import { Pose } from '../pose/pose_domain';

export interface Map {
  location_id: number;
  sector_id: number;
  map_id: number;
  map_name: string;
  map_location: string;
  style_name: string;
  style_value: string;
  meta?: MapMeta;
  image?: MapImage;
  ratio: number;
  user_id: number;
  updated_at?: Date;
  created_at?: Date;
}

export interface MapMeta {
  resolution: number;
  width: number;
  height: number;
  origin: Pose;
}

export interface MapImage {
  mime: string;
  data: string;
}

export interface MapFilter {
  databaseName: string;
  collectionName: string;
  mapId: number;
  sectorId: number;
  locationId: number;
}

export interface MapUsecase {
  fetch(ctx: any, filter: MapFilter): Promise<Map[]>;
  getMap(ctx: any, filter: MapFilter): Promise<Map | null>;
  add(ctx: any, filter: MapFilter, arg: Map): Promise<Map>;
  update(ctx: any, filter: MapFilter, arg: Map): Promise<Map>;
  delete(ctx: any, filter: MapFilter, arg: Map): Promise<number>;
}

export interface MapRepository {
  fetch(ctx: any, filter: MapFilter): Promise<Map[]>;
  getMap(ctx: any, filter: MapFilter): Promise<Map | null>;
  add(ctx: any, filter: MapFilter, arg: Map): Promise<Map>;
  update(ctx: any, filter: MapFilter, arg: Map): Promise<Map>;
  delete(ctx: any, filter: MapFilter, arg: Map): Promise<number>;
}

