import { Goal } from '../goal/goal_domain';
import { Tag } from '../tag/tag_domain';
import { Pipe } from '../pipe/pipe_domain';
import { Area } from '../area/area_domain';

export interface MJob {
  job_id: number;
  job_name: string;
  job_order: number;
  job_status: number;
  job_message: string;
  location_id: number;
  sector_id: number;
  robot_id: number;
  job_tasks?: MJobTask[];
  job_started: number;
  job_finished: number;
  create_user: string;
  create_date?: Date;
  update_user: string;
  update_date?: Date;
  update_count: number;
  job_lock: boolean;
  job_unlock: boolean;
}

export interface MJobTask {
  id: number;
  name: string;
  text: string;
  explanation: string;
  label: string;
  placeholder: string;
  show: number;
  number: number;
  goal_id?: number;
  pipe_id?: number;
  sub_tasks?: MSubTask[];
  options?: MJob[];
  switch?: MSwitchTask[];
  tag?: Tag;
  tag_id?: number;
  goal?: Goal;
  pipe?: Pipe;
  range?: number[];
  boolean?: boolean;
  area_id?: number;
  area?: Area;
  grab?: MGrab;
  status: number;
  message: string;
  started: number;
  finished: number;
  break: boolean;
  skip: boolean;
}

export interface MSwitchTask {
  name: string;
  selected: boolean;
  status: number;
  tasks: MSubTask[];
}

export interface MSubTask {
  id: number;
  name: string;
  text: string;
  explanation: string;
  label: string;
  placeholder: string;
  show: number;
  number: number;
  array?: number[];
  goal_id?: number;
  goal?: Goal;
  pipe_id?: number;
  status: number;
  message: string;
  started: number;
  finished: number;
  tag_id?: number;
  tag?: Tag;
  pipe?: Pipe;
  range?: number[];
  boolean?: boolean;
  area_id?: number;
  area?: Area;
  grab?: MGrab;
  break: boolean;
  skip: boolean;
}

export interface MGrab {
  range: number[];
  goals: MGrabGoal[];
  areas: MGrabArea[];
  join_path: MGrabJoin[];
}

export interface MGrabGoal {
  tag: number;
  goal_id: number;
  goal?: Goal;
}

export interface MGrabArea {
  goal_id: number;
  area_id: number;
  area?: Area;
}

export interface MGrabJoin {
  area_id: number;
  goal_id: number;
  goal?: Goal;
}

export interface MJobFilter {
  databaseName: string;
  collectionName: string;
  locationId: number;
  sectorId: number;
  jobId: number;
}

export interface MJobUsecase {
  fetch(ctx: any, filter: MJobFilter): Promise<MJob[]>;
  add(ctx: any, filter: MJobFilter, arg: MJob): Promise<MJob>;
  update(ctx: any, filter: MJobFilter, arg: MJob): Promise<MJob>;
  delete(ctx: any, filter: MJobFilter, arg: MJob): Promise<number>;
}

export interface MJobRepository {
  fetch(ctx: any, filter: MJobFilter): Promise<MJob[]>;
  add(ctx: any, filter: MJobFilter, arg: MJob): Promise<MJob>;
  update(ctx: any, filter: MJobFilter, arg: MJob): Promise<MJob>;
  delete(ctx: any, filter: MJobFilter, arg: MJob): Promise<number>;
}

