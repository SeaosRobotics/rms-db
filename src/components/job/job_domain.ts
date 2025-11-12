import { Goal } from '../goal/goal_domain';
import { Tag } from '../tag/tag_domain';
import { Pipe } from '../pipe/pipe_domain';
import { Area } from '../area/area_domain';
import { Point } from '../point/point_domain';
import { Quaternion } from '../quaternion/quaternion_domain';
import { Pose } from '../pose/pose_domain';

export interface Job {
  job_id: number;
  job_name: string;
  job_order: number;
  job_status: number;
  job_message: string;
  location_id: number;
  sector_id: number;
  robot_id: number;
  job_tasks?: JobTask[];
  job_started: number;
  job_finished: number;
  create_user: string;
  create_date: number;
  update_user: string;
  update_date: number;
  update_count: number;
  job_lock: boolean;
  job_unlock: boolean;
}

export interface JobTask {
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
  pipe?: Pipe;
  range?: number[];
  tag?: Tag;
  tag_id?: number;
  boolean?: boolean;
  area_id?: number;
  area?: Area;
  grab?: Grab;
  sub_tasks?: SubTask[];
  options?: Job[];
  switch?: SwitchTask[];
  status: number;
  message: string;
  started: number;
  finished: number;
  break: boolean;
  skip: boolean;
}

export interface SwitchTask {
  name: string;
  selected: boolean;
  status: number;
  tasks: SubTask[];
}

export interface SubTask {
  sub_id: number;
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
  pipe?: Pipe;
  range?: number[];
  tag?: Tag;
  tag_id?: number;
  boolean?: boolean;
  area_id?: number;
  area?: Area;
  grab?: Grab;
  status: number;
  message: string;
  started: number;
  finished: number;
  break: boolean;
  skip: boolean;
}

export interface Grab {
  range?: number[];
  goals?: GrabGoal[];
  areas?: GrabArea[];
  join_path?: GrabJoin[];
}

export interface GrabGoal {
  tag: number;
  goal_id: number;
  goal?: Goal;
}

export interface GrabArea {
  goal_id: number;
  area_id: number;
  area?: Area;
}

export interface GrabJoin {
  area_id: number;
  goal_id: number;
  goal?: Goal;
}

export interface JobFilter {
  databaseName: string;
  collectionName: string;
  locationId: number;
  sectorId: number;
  robotId: number;
  jobId: number;
  jobStatus: number;
  jobStarted: number;
  jobFinished: number;
  fetchOffset: number;
  fetchLimit: number;
  filterType: number;
  sortType: number;
  orderType: number;
}

export interface JobUsecase {
  fetch(ctx: any, filter: JobFilter): Promise<Job[]>;
  add(ctx: any, filter: JobFilter, arg: Job): Promise<number>;
  update(ctx: any, filter: JobFilter, arg: Job): Promise<void>;
  delete(ctx: any, filter: JobFilter, jobId: number): Promise<void>;
}

export interface JobRepository {
  fetch(ctx: any, filter: JobFilter): Promise<Job[]>;
  add(ctx: any, filter: JobFilter, arg: Job): Promise<number>;
  update(ctx: any, filter: JobFilter, arg: Job): Promise<void>;
  delete(ctx: any, filter: JobFilter, jobId: number): Promise<void>;
}

