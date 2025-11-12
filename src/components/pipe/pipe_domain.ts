import { Point } from '../point/point_domain';

export interface Pipe {
  id: number;
  sector_id: number;
  location_id: number;
  name: string;
  closed: boolean;
  path: PathSegment[];
}

export interface PathSegment {
  id: number;
  name: string;
  point: Point;
  radius: number;
  shift_from_centre: number;
  can_overtake: number;
}

export interface PipeFilter {
  databaseName: string;
  collectionName: string;
  locationId: number;
  sectorId: number;
  pipeId: number;
}

export interface PipeUsecase {
  fetch(ctx: any, filter: PipeFilter): Promise<Pipe[]>;
  add(ctx: any, filter: PipeFilter, arg: Pipe): Promise<Pipe[]>;
  update(ctx: any, filter: PipeFilter, arg: Pipe): Promise<Pipe[]>;
  delete(ctx: any, filter: PipeFilter, arg: Pipe): Promise<Pipe[]>;
}

export interface PipeRepository {
  fetch(ctx: any, filter: PipeFilter): Promise<Pipe[]>;
  add(ctx: any, filter: PipeFilter, arg: Pipe): Promise<Pipe[]>;
  update(ctx: any, filter: PipeFilter, arg: Pipe): Promise<Pipe[]>;
  delete(ctx: any, filter: PipeFilter, arg: Pipe): Promise<Pipe[]>;
}

