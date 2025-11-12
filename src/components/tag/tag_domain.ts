export interface Tag {
  tag_id: number;
  location_id: number;
  sector_id: number;
  tag_name: string;
  tag_group: string;
  tag_no: number;
  turn_dir: number;
  turn_angle: number;
  turn_dist: number;
  turn_init: number;
  radius: number;
  user_id: number;
  updated_at?: Date;
  created_at?: Date;
}

export interface TagFilter {
  databaseName: string;
  collectionName: string;
  locationId: number;
  sectorId: number;
  tagId: number;
}

export interface TagUsecase {
  fetch(ctx: any, filter: TagFilter): Promise<Tag[]>;
}

export interface TagRepository {
  fetch(ctx: any, filter: TagFilter): Promise<Tag[]>;
}

