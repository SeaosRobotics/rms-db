export interface Sector {
  sector_id: number;
  sector_name: string;
  location_id: number;
  orchestration_bridge?: number[];
  map_id?: number;
  user_id: number;
  updated_at?: Date;
  created_at?: Date;
}

export interface SectorFilter {
  databaseName: string;
  collectionName: string;
  locationId: number;
  sectorId: number;
}

export interface SectorUsecase {
  fetch(ctx: any, filter: SectorFilter): Promise<Sector[]>;
  fetchOne(ctx: any, filter: SectorFilter): Promise<Sector | null>;
  add(ctx: any, filter: SectorFilter, arg: Sector): Promise<{ sectorId: number; sectorName: string }>;
  update(ctx: any, filter: SectorFilter, arg: Sector): Promise<{ sectorId: number; sectorName: string }>;
  delete(ctx: any, filter: SectorFilter, arg: Sector): Promise<{ sectorId: number; sectorName: string }>;
}

export interface SectorRepository {
  fetch(ctx: any, filter: SectorFilter): Promise<Sector[]>;
  fetchOne(ctx: any, filter: SectorFilter): Promise<Sector | null>;
  add(ctx: any, filter: SectorFilter, arg: Sector): Promise<{ sectorId: number; sectorName: string }>;
  update(ctx: any, filter: SectorFilter, arg: Sector): Promise<{ sectorId: number; sectorName: string }>;
  delete(ctx: any, filter: SectorFilter, arg: Sector): Promise<{ sectorId: number; sectorName: string }>;
}

