// This file contains the TypeScript interfaces matching the proto definitions
// In a production setup, these would be generated from the proto file

export interface GetLocationRequest {
  client_id: number;
}

export interface GetLocationResponse {
  locations: Location[];
}

export interface Location {
  location_id: number;
  client_id: number;
  location_name: string;
  sectors?: Sector[];
  user_id: number;
}

export interface Sector {
  sector_id: number;
  sector_name: string;
  map_id?: number;
  map?: Map;
  robots?: Robot[];
  goals?: Goal[];
  tags?: Tag[];
  pipes?: Pipe[];
  jobs?: Job[];
  areas?: Area[];
  location_id: number;
  user_id: number;
  orchestration_bridge?: number[];
}

export interface Map {
  map_id: number;
  map_name: string;
  map_location: string;
  style_name: string;
  style_value: string;
  meta?: MapMeta;
  image?: MapImage;
  ratio: number;
  sector_id: number;
  location_id: number;
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

export interface Pose {
  position: Point;
  orientation: Quaternion;
}

export interface Point {
  x: number;
  y: number;
  z: number;
}

export interface Quaternion {
  x: number;
  y: number;
  z: number;
  w: number;
}

export interface Robot {
  robot_id: number;
  robot_name: string;
  robot_type: string;
  status: number;
  availableUp: number;
  availableDown: number;
  pose: string;
  battery: string;
  slam: number;
  dock_id: number;
  host: string;
  port: string;
}

export interface Goal {
  goal_id: number;
  goal_name: string;
  pose?: Pose;
}

export interface Tag {
  tag_id: number;
  tag_name: string;
  tag_group: string;
  tag_no: number;
  turn_dir: number;
  turn_angle: number;
  turn_dist: number;
  turn_init: number;
  radius: number;
}

export interface Pipe {
  id: number;
  location_id: number;
  sector_id: number;
  name: string;
  closed: boolean;
  path?: PathSegment[];
}

export interface PathSegment {
  id: number;
  name: string;
  point: Point;
  radius: number;
  shift_from_centre: number;
  can_overtake: number;
}

export interface Area {
  id: number;
  name: string;
  polygon: Point[];
  location: number;
  sector: number;
}

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

// Request/Response types for various endpoints
export interface GetJobRequest {
  sector_id: number;
  location_id: number;
  robot_id: number;
  job_id: number;
  job_status: number;
  job_from_date?: Date;
  job_to_date?: Date;
  fetch_offset: number;
  fetch_limit: number;
  filter_type: number;
  sort_type: number;
  order_type: number;
}

export interface GetJobResponse {
  jobs: Job[];
}

export interface AddJobRequest {
  job: Job;
}

export interface AddJobResponse {
  result: number;
  job_id: number;
}

export interface UpdateJobRequest {
  job: Job;
}

export interface UpdateJobResponse {
  result: number;
  job_id: number;
}

export interface DeleteJobRequest {
  job_id: number;
}

export interface DeleteJobResponse {
  result: number;
}

// Add more request/response types as needed...

