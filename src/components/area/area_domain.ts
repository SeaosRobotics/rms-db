import { Point } from '../point/point_domain';

export interface Area {
  id: number;
  name: string;
  location: number;
  sector: number;
  polygon: Point[];
}

export interface AreaFilter {
  databaseName: string;
  collectionName: string;
  location: number;
  sector: number;
  id: number;
}

export interface AreaUsecase {
  fetch(ctx: any, filter: AreaFilter): Promise<Area[]>;
}

export interface AreaRepository {
  fetch(ctx: any, filter: AreaFilter): Promise<Area[]>;
}

