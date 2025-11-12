import { MongoClient } from 'mongodb';
import logger from '../../tools/logger/logger';

// Location
import { LocationUsecaseImpl } from '../../components/location/location_usecase';
import { LocationRepositoryImpl } from '../../components/location/location_repository';
import { Location, LocationFilter } from '../../components/location/location_domain';

// Sector
import { SectorUsecaseImpl } from '../../components/sector/sector_usecase';
import { SectorRepositoryImpl } from '../../components/sector/sector_repository';
import { Sector, SectorFilter } from '../../components/sector/sector_domain';

// Job
import { JobUsecaseImpl } from '../../components/job/job_usecase';
import { JobRepositoryImpl } from '../../components/job/job_repository';
import { Job, JobFilter } from '../../components/job/job_domain';

// Robot
import { RobotUsecaseImpl } from '../../components/robot/robot_usecase';
import { RobotRepositoryImpl } from '../../components/robot/robot_repository';
import { Robot, RobotFilter } from '../../components/robot/robot_domain';

// Goal
import { GoalUsecaseImpl } from '../../components/goal/goal_usecase';
import { GoalRepositoryImpl } from '../../components/goal/goal_repository';
import { Goal, GoalFilter } from '../../components/goal/goal_domain';

// Tag
import { TagUsecaseImpl } from '../../components/tag/tag_usecase';
import { TagRepositoryImpl } from '../../components/tag/tag_repository';
import { Tag, TagFilter } from '../../components/tag/tag_domain';

// Pipe
import { PipeUsecaseImpl } from '../../components/pipe/pipe_usecase';
import { PipeRepositoryImpl } from '../../components/pipe/pipe_repository';
import { Pipe, PipeFilter } from '../../components/pipe/pipe_domain';

// Area
import { AreaUsecaseImpl } from '../../components/area/area_usecase';
import { AreaRepositoryImpl } from '../../components/area/area_repository';
import { Area, AreaFilter } from '../../components/area/area_domain';

// Map
import { MapUsecaseImpl } from '../../components/maps/map_usecase';
import { MapRepositoryImpl } from '../../components/maps/map_repository';
import { Map, MapFilter } from '../../components/maps/map_domain';

// Task
import { TaskUsecaseImpl } from '../../components/task/task_usecase';
import { TaskRepositoryImpl } from '../../components/task/task_repository';
import { Task, TaskFilter } from '../../components/task/task_domain';

// Station
import { StationUsecaseImpl } from '../../components/station/station_usecase';
import { StationRepositoryImpl } from '../../components/station/station_repository';
import { Station, StationFilter } from '../../components/station/station_domain';

// User
import { UserUsecaseImpl } from '../../components/user/user_usecase';
import { UserRepositoryImpl } from '../../components/user/user_repository';
import { User, UserFilter } from '../../components/user/user_domain';

// UserWorkspace
import { UserWorkspaceUsecaseImpl } from '../../components/userworkspace/userworkspace_usecase';
import { UserWorkspaceRepositoryImpl } from '../../components/userworkspace/userworkspace_repository';
import { UserWorkspace, UserWorkspaceFilter, UserLocation, UserSector } from '../../components/userworkspace/userworkspace_domain';

// Notification
import { NotificationUsecaseImpl } from '../../components/notification/notification_usecase';
import { NotificationRepositoryImpl } from '../../components/notification/notification_repository';
import { Notification, NotificationFilter } from '../../components/notification/notification_domain';

// Localization
import { LocalizationUsecaseImpl } from '../../components/localization/localization_usecase';
import { LocalizationRepositoryImpl } from '../../components/localization/localization_repository';
import { Localization, LocalizationFilter } from '../../components/localization/localization_domain';

// RobotStatus
import { RobotStatusUsecaseImpl } from '../../components/robotstatus/robotstatus_usecase';
import { RobotStatusRepositoryImpl } from '../../components/robotstatus/robotstatus_repository';
import { RobotStatus, RobotStatusFilter } from '../../components/robotstatus/robotstatus_domain';

// CustomLog
import { CustomLogUsecaseImpl } from '../../components/customlog/customlog_usecase';
import { CustomLogRepositoryImpl } from '../../components/customlog/customlog_repository';
import { CustomLog, CustomLogFilter } from '../../components/customlog/customlog_domain';

// MJob
import { MJobUsecaseImpl } from '../../components/mjob/mjob_usecase';
import { MJobRepositoryImpl } from '../../components/mjob/mjob_repository';
import { MJob, MJobFilter } from '../../components/mjob/mjob_domain';

export interface BackendApiUsecase {
  // Location
  getLocationNosql(ctx: any, filter: LocationFilter): Promise<Location[]>;
  addLocation(ctx: any, filter: LocationFilter, arg: Location): Promise<{ locationId: number; locationName: string }>;
  updateLocation(ctx: any, filter: LocationFilter, arg: Location): Promise<{ locationId: number; locationName: string }>;
  deleteLocation(ctx: any, filter: LocationFilter, arg: Location): Promise<number>;
  
  // Sector
  getSectorNosql(ctx: any, filter: SectorFilter): Promise<Sector[]>;
  fetchSector(ctx: any, filter: SectorFilter): Promise<Sector | null>;
  addSector(ctx: any, filter: SectorFilter, arg: Sector): Promise<{ sectorId: number; sectorName: string }>;
  updateSector(ctx: any, filter: SectorFilter, arg: Sector): Promise<{ sectorId: number; sectorName: string }>;
  deleteSector(ctx: any, filter: SectorFilter, arg: Sector): Promise<{ sectorId: number; sectorName: string }>;
  
  // Job
  getJobNosql(ctx: any, filter: JobFilter): Promise<Job[]>;
  addJobNosql(ctx: any, filter: JobFilter, arg: Job): Promise<number>;
  updateJobNosql(ctx: any, filter: JobFilter, arg: Job): Promise<void>;
  deleteJobNosql(ctx: any, filter: JobFilter, jobId: number): Promise<void>;
  
  // Robot
  getRobotsNosql(ctx: any, filter: RobotFilter): Promise<Robot[]>;
  updateRobotNosql(ctx: any, filter: RobotFilter, robot: Robot): Promise<void>;
  addRobotNosql(ctx: any, filter: RobotFilter, robot: Robot): Promise<void>;
  deleteRobotNosql(ctx: any, filter: RobotFilter, robotId: number): Promise<void>;
  
  // Goal
  getGoalNosql(ctx: any, filter: GoalFilter): Promise<Goal[]>;
  
  // Tag
  getTagNosql(ctx: any, filter: TagFilter): Promise<Tag[]>;
  
  // Pipe
  getPipeNosql(ctx: any, filter: PipeFilter): Promise<Pipe[]>;
  savePipe(ctx: any, filter: PipeFilter, arg: Pipe): Promise<Pipe[]>;
  updatePipe(ctx: any, filter: PipeFilter, arg: Pipe): Promise<Pipe[]>;
  deletePipe(ctx: any, filter: PipeFilter, arg: Pipe): Promise<Pipe[]>;
  
  // Area
  getAreaNosql(ctx: any, filter: AreaFilter): Promise<Area[]>;
  
  // Map
  getMapNosql(ctx: any, filter: MapFilter): Promise<Map[]>;
  getMap(ctx: any, filter: MapFilter): Promise<Map | null>;
  saveMapNosql(ctx: any, filter: MapFilter, arg: Map): Promise<Map>;
  updateMapNosql(ctx: any, filter: MapFilter, arg: Map): Promise<Map>;
  deleteMapNosql(ctx: any, filter: MapFilter, arg: Map): Promise<number>;
  
  // Task
  getTasks(ctx: any, filter: TaskFilter): Promise<Task[]>;
  getTask(ctx: any, filter: TaskFilter): Promise<Task | null>;
  
  // Station
  getStations(ctx: any, filter: StationFilter): Promise<Station[]>;
  getStation(ctx: any, filter: StationFilter): Promise<Station | null>;
  addStation(ctx: any, filter: StationFilter, station: Station): Promise<number>;
  updateStation(ctx: any, filter: StationFilter, station: Station): Promise<void>;
  deleteStation(ctx: any, filter: StationFilter, stationId: number): Promise<void>;
  
  // User
  getUsersNosql(ctx: any, filter: UserFilter): Promise<User[]>;
  getUserNosql(ctx: any, filter: UserFilter): Promise<User[]>;
  addUserNosql(ctx: any, filter: UserFilter, arg: User): Promise<number>;
  updateUserNosql(ctx: any, filter: UserFilter, arg: User): Promise<void>;
  deleteUserNosql(ctx: any, filter: UserFilter, userId: number): Promise<void>;
  
  // UserWorkspace
  getUserWorkspaceNosql(ctx: any, filter: UserWorkspaceFilter): Promise<UserWorkspace[]>;
  addUserWorkspaceLocation(ctx: any, filter: UserWorkspaceFilter, arg: UserLocation): Promise<UserWorkspace[]>;
  addUserWorkspaceSector(ctx: any, filter: UserWorkspaceFilter, arg: UserSector): Promise<UserWorkspace[]>;
  updateUserWorkspaceLocation(ctx: any, filter: UserWorkspaceFilter, arg: UserLocation): Promise<UserWorkspace[]>;
  updateUserWorkspaceSector(ctx: any, filter: UserWorkspaceFilter, arg: UserSector): Promise<UserWorkspace[]>;
  deleteUserWorkspaceLocation(ctx: any, filter: UserWorkspaceFilter, arg: UserLocation): Promise<UserWorkspace[]>;
  deleteUserWorkspaceSector(ctx: any, filter: UserWorkspaceFilter, arg: UserSector): Promise<UserWorkspace[]>;
  
  // Notification
  getNotificationNosql(ctx: any, filter: NotificationFilter): Promise<Notification[]>;
  addNotificationNosql(ctx: any, filter: NotificationFilter, arg: Notification): Promise<number>;
  updateNotificationNosql(ctx: any, filter: NotificationFilter, arg: Notification): Promise<void>;
  
  // Localization
  getLocalizationNosql(ctx: any, filter: LocalizationFilter): Promise<Localization[]>;
  addLocalizationNosql(ctx: any, filter: LocalizationFilter, arg: Localization): Promise<number>;
  
  // RobotStatus
  getRobotStatusNosql(ctx: any, filter: RobotStatusFilter): Promise<RobotStatus[]>;
  addRobotStatusNosql(ctx: any, filter: RobotStatusFilter, arg: RobotStatus): Promise<number>;
  
  // CustomLog
  getCustomLogNosql(ctx: any, filter: CustomLogFilter): Promise<CustomLog[]>;
  addCustomLogNosql(ctx: any, filter: CustomLogFilter, arg: CustomLog): Promise<number>;
  
  // MJob
  getMJobNosql(ctx: any, filter: MJobFilter): Promise<MJob[]>;
  saveMJobNosql(ctx: any, filter: MJobFilter, arg: MJob): Promise<MJob>;
  updateMJobNosql(ctx: any, filter: MJobFilter, arg: MJob): Promise<MJob>;
  deleteMJobNosql(ctx: any, filter: MJobFilter, arg: MJob): Promise<number>;
}

export class BackendApiUsecaseImpl implements BackendApiUsecase {
  private locationUsecase: LocationUsecaseImpl;
  private sectorUsecase: SectorUsecaseImpl;
  private jobUsecase: JobUsecaseImpl;
  private robotUsecase: RobotUsecaseImpl;
  private goalUsecase: GoalUsecaseImpl;
  private tagUsecase: TagUsecaseImpl;
  private pipeUsecase: PipeUsecaseImpl;
  private areaUsecase: AreaUsecaseImpl;
  private mapUsecase: MapUsecaseImpl;
  private taskUsecase: TaskUsecaseImpl;
  private stationUsecase: StationUsecaseImpl;
  private userUsecase: UserUsecaseImpl;
  private userWorkspaceUsecase: UserWorkspaceUsecaseImpl;
  private notificationUsecase: NotificationUsecaseImpl;
  private localizationUsecase: LocalizationUsecaseImpl;
  private robotStatusUsecase: RobotStatusUsecaseImpl;
  private customLogUsecase: CustomLogUsecaseImpl;
  private mjobUsecase: MJobUsecaseImpl;
  
  constructor(
    private conn: MongoClient,
    private dbName: string,
    private timeout: number,
    private log: typeof logger
  ) {
    // Initialize all usecases
    this.locationUsecase = new LocationUsecaseImpl(
      new LocationRepositoryImpl(conn, log),
      timeout,
      log
    );
    
    this.sectorUsecase = new SectorUsecaseImpl(
      new SectorRepositoryImpl(conn, log),
      timeout,
      log
    );
    
    this.jobUsecase = new JobUsecaseImpl(
      new JobRepositoryImpl(conn, log),
      timeout,
      log
    );
    
    this.robotUsecase = new RobotUsecaseImpl(
      new RobotRepositoryImpl(conn, log),
      timeout,
      log
    );
    
    this.goalUsecase = new GoalUsecaseImpl(
      new GoalRepositoryImpl(conn, log),
      timeout,
      log
    );
    
    this.tagUsecase = new TagUsecaseImpl(
      new TagRepositoryImpl(conn, log),
      timeout,
      log
    );
    
    this.pipeUsecase = new PipeUsecaseImpl(
      new PipeRepositoryImpl(conn, log),
      timeout,
      log
    );
    
    this.areaUsecase = new AreaUsecaseImpl(
      new AreaRepositoryImpl(conn, log),
      timeout,
      log
    );
    
    this.mapUsecase = new MapUsecaseImpl(
      new MapRepositoryImpl(conn, log),
      timeout,
      log
    );
    
    this.taskUsecase = new TaskUsecaseImpl(
      new TaskRepositoryImpl(conn, log),
      timeout,
      log
    );
    
    this.stationUsecase = new StationUsecaseImpl(
      new StationRepositoryImpl(conn, log),
      timeout,
      log
    );
    
    this.userUsecase = new UserUsecaseImpl(
      new UserRepositoryImpl(conn, log),
      timeout,
      log
    );
    
    this.userWorkspaceUsecase = new UserWorkspaceUsecaseImpl(
      new UserWorkspaceRepositoryImpl(conn, log),
      timeout,
      log
    );
    
    this.notificationUsecase = new NotificationUsecaseImpl(
      new NotificationRepositoryImpl(conn, log),
      timeout,
      log
    );
    
    this.localizationUsecase = new LocalizationUsecaseImpl(
      new LocalizationRepositoryImpl(conn, log),
      timeout,
      log
    );
    
    this.robotStatusUsecase = new RobotStatusUsecaseImpl(
      new RobotStatusRepositoryImpl(conn, log),
      timeout,
      log
    );
    
    this.customLogUsecase = new CustomLogUsecaseImpl(
      new CustomLogRepositoryImpl(conn, log),
      timeout,
      log
    );
    
    this.mjobUsecase = new MJobUsecaseImpl(
      new MJobRepositoryImpl(conn, log),
      timeout,
      log
    );
  }
  
  // Location methods
  async getLocationNosql(ctx: any, filter: LocationFilter): Promise<Location[]> {
    return this.locationUsecase.fetch(ctx, filter);
  }
  
  async addLocation(ctx: any, filter: LocationFilter, arg: Location): Promise<{ locationId: number; locationName: string }> {
    return this.locationUsecase.add(ctx, filter, arg);
  }
  
  async updateLocation(ctx: any, filter: LocationFilter, arg: Location): Promise<{ locationId: number; locationName: string }> {
    return this.locationUsecase.update(ctx, filter, arg);
  }
  
  async deleteLocation(ctx: any, filter: LocationFilter, arg: Location): Promise<number> {
    return this.locationUsecase.delete(ctx, filter, arg);
  }
  
  // Sector methods
  async getSectorNosql(ctx: any, filter: SectorFilter): Promise<Sector[]> {
    return this.sectorUsecase.fetch(ctx, filter);
  }
  
  async fetchSector(ctx: any, filter: SectorFilter): Promise<Sector | null> {
    return this.sectorUsecase.fetchOne(ctx, filter);
  }
  
  async addSector(ctx: any, filter: SectorFilter, arg: Sector): Promise<{ sectorId: number; sectorName: string }> {
    return this.sectorUsecase.add(ctx, filter, arg);
  }
  
  async updateSector(ctx: any, filter: SectorFilter, arg: Sector): Promise<{ sectorId: number; sectorName: string }> {
    return this.sectorUsecase.update(ctx, filter, arg);
  }
  
  async deleteSector(ctx: any, filter: SectorFilter, arg: Sector): Promise<{ sectorId: number; sectorName: string }> {
    return this.sectorUsecase.delete(ctx, filter, arg);
  }
  
  // Job methods
  async getJobNosql(ctx: any, filter: JobFilter): Promise<Job[]> {
    return this.jobUsecase.fetch(ctx, filter);
  }
  
  async addJobNosql(ctx: any, filter: JobFilter, arg: Job): Promise<number> {
    return this.jobUsecase.add(ctx, filter, arg);
  }
  
  async updateJobNosql(ctx: any, filter: JobFilter, arg: Job): Promise<void> {
    return this.jobUsecase.update(ctx, filter, arg);
  }
  
  async deleteJobNosql(ctx: any, filter: JobFilter, jobId: number): Promise<void> {
    return this.jobUsecase.delete(ctx, filter, jobId);
  }
  
  // Robot methods
  async getRobotsNosql(ctx: any, filter: RobotFilter): Promise<Robot[]> {
    return this.robotUsecase.fetch(ctx, filter);
  }
  
  async updateRobotNosql(ctx: any, filter: RobotFilter, robot: Robot): Promise<void> {
    return this.robotUsecase.update(ctx, filter, robot);
  }
  
  async addRobotNosql(ctx: any, filter: RobotFilter, robot: Robot): Promise<void> {
    return this.robotUsecase.addNewRobot(ctx, filter, robot);
  }
  
  async deleteRobotNosql(ctx: any, filter: RobotFilter, robotId: number): Promise<void> {
    const robot: Robot = {
      robot_id: robotId,
      location_id: filter.locationId,
      sector_id: filter.sectorId,
      robot_name: '',
      robot_type: '',
      status: 0,
      availableUp: 0,
      availableDown: 0,
      pose: '',
      battery: '',
      slam: 0,
      dock_id: 0,
      host: '',
      port: '',
      user_id: 0,
    };
    return this.robotUsecase.deleteRobot(ctx, filter, robot);
  }
  
  // Goal methods
  async getGoalNosql(ctx: any, filter: GoalFilter): Promise<Goal[]> {
    return this.goalUsecase.fetch(ctx, filter);
  }
  
  // Tag methods
  async getTagNosql(ctx: any, filter: TagFilter): Promise<Tag[]> {
    return this.tagUsecase.fetch(ctx, filter);
  }
  
  // Pipe methods
  async getPipeNosql(ctx: any, filter: PipeFilter): Promise<Pipe[]> {
    return this.pipeUsecase.fetch(ctx, filter);
  }
  
  async savePipe(ctx: any, filter: PipeFilter, arg: Pipe): Promise<Pipe[]> {
    return this.pipeUsecase.add(ctx, filter, arg);
  }
  
  async updatePipe(ctx: any, filter: PipeFilter, arg: Pipe): Promise<Pipe[]> {
    return this.pipeUsecase.update(ctx, filter, arg);
  }
  
  async deletePipe(ctx: any, filter: PipeFilter, arg: Pipe): Promise<Pipe[]> {
    return this.pipeUsecase.delete(ctx, filter, arg);
  }
  
  // Area methods
  async getAreaNosql(ctx: any, filter: AreaFilter): Promise<Area[]> {
    return this.areaUsecase.fetch(ctx, filter);
  }
  
  // Map methods
  async getMapNosql(ctx: any, filter: MapFilter): Promise<Map[]> {
    return this.mapUsecase.fetch(ctx, filter);
  }
  
  async getMap(ctx: any, filter: MapFilter): Promise<Map | null> {
    return this.mapUsecase.getMap(ctx, filter);
  }
  
  async saveMapNosql(ctx: any, filter: MapFilter, arg: Map): Promise<Map> {
    return this.mapUsecase.add(ctx, filter, arg);
  }
  
  async updateMapNosql(ctx: any, filter: MapFilter, arg: Map): Promise<Map> {
    return this.mapUsecase.update(ctx, filter, arg);
  }
  
  async deleteMapNosql(ctx: any, filter: MapFilter, arg: Map): Promise<number> {
    return this.mapUsecase.delete(ctx, filter, arg);
  }
  
  // Task methods
  async getTasks(ctx: any, filter: TaskFilter): Promise<Task[]> {
    return this.taskUsecase.fetch(ctx, filter);
  }
  
  async getTask(ctx: any, filter: TaskFilter): Promise<Task | null> {
    return this.taskUsecase.fetchOne(ctx, filter);
  }
  
  // Station methods
  async getStations(ctx: any, filter: StationFilter): Promise<Station[]> {
    return this.stationUsecase.fetch(ctx, filter);
  }
  
  async getStation(ctx: any, filter: StationFilter): Promise<Station | null> {
    return this.stationUsecase.fetchOne(ctx, filter);
  }
  
  async addStation(ctx: any, filter: StationFilter, station: Station): Promise<number> {
    return this.stationUsecase.add(ctx, filter, station);
  }
  
  async updateStation(ctx: any, filter: StationFilter, station: Station): Promise<void> {
    return this.stationUsecase.update(ctx, filter, station);
  }
  
  async deleteStation(ctx: any, filter: StationFilter, stationId: number): Promise<void> {
    const station: Station = {
      id: stationId,
      location_id: filter.locationId,
      sector_id: filter.sectorId,
      number: 0,
      name: '',
      robot_id: 0,
      status: 0,
    };
    return this.stationUsecase.delete(ctx, filter, station);
  }
  
  // User methods
  async getUsersNosql(ctx: any, filter: UserFilter): Promise<User[]> {
    return this.userUsecase.fetch(ctx, filter);
  }
  
  async getUserNosql(ctx: any, filter: UserFilter): Promise<User[]> {
    return this.userUsecase.fetch(ctx, filter);
  }
  
  async addUserNosql(ctx: any, filter: UserFilter, arg: User): Promise<number> {
    return this.userUsecase.add(ctx, filter, arg);
  }
  
  async updateUserNosql(ctx: any, filter: UserFilter, arg: User): Promise<void> {
    return this.userUsecase.update(ctx, filter, arg);
  }
  
  async deleteUserNosql(ctx: any, filter: UserFilter, userId: number): Promise<void> {
    return this.userUsecase.delete(ctx, filter, userId);
  }
  
  // UserWorkspace methods
  async getUserWorkspaceNosql(ctx: any, filter: UserWorkspaceFilter): Promise<UserWorkspace[]> {
    return this.userWorkspaceUsecase.fetch(ctx, filter);
  }
  
  async addUserWorkspaceLocation(ctx: any, filter: UserWorkspaceFilter, arg: UserLocation): Promise<UserWorkspace[]> {
    return this.userWorkspaceUsecase.add(ctx, filter, arg);
  }
  
  async addUserWorkspaceSector(ctx: any, filter: UserWorkspaceFilter, arg: UserSector): Promise<UserWorkspace[]> {
    return this.userWorkspaceUsecase.addSector(ctx, filter, arg);
  }
  
  async updateUserWorkspaceLocation(ctx: any, filter: UserWorkspaceFilter, arg: UserLocation): Promise<UserWorkspace[]> {
    return this.userWorkspaceUsecase.update(ctx, filter, arg);
  }
  
  async updateUserWorkspaceSector(ctx: any, filter: UserWorkspaceFilter, arg: UserSector): Promise<UserWorkspace[]> {
    return this.userWorkspaceUsecase.updateSector(ctx, filter, arg);
  }
  
  async deleteUserWorkspaceLocation(ctx: any, filter: UserWorkspaceFilter, arg: UserLocation): Promise<UserWorkspace[]> {
    return this.userWorkspaceUsecase.delete(ctx, filter, arg);
  }
  
  async deleteUserWorkspaceSector(ctx: any, filter: UserWorkspaceFilter, arg: UserSector): Promise<UserWorkspace[]> {
    return this.userWorkspaceUsecase.deleteSector(ctx, filter, arg);
  }
  
  // Notification methods
  async getNotificationNosql(ctx: any, filter: NotificationFilter): Promise<Notification[]> {
    return this.notificationUsecase.fetch(ctx, filter);
  }
  
  async addNotificationNosql(ctx: any, filter: NotificationFilter, arg: Notification): Promise<number> {
    return this.notificationUsecase.add(ctx, filter, arg);
  }
  
  async updateNotificationNosql(ctx: any, filter: NotificationFilter, arg: Notification): Promise<void> {
    return this.notificationUsecase.update(ctx, filter, arg);
  }
  
  // Localization methods
  async getLocalizationNosql(ctx: any, filter: LocalizationFilter): Promise<Localization[]> {
    return this.localizationUsecase.fetch(ctx, filter);
  }
  
  async addLocalizationNosql(ctx: any, filter: LocalizationFilter, arg: Localization): Promise<number> {
    return this.localizationUsecase.add(ctx, filter, arg);
  }
  
  // RobotStatus methods
  async getRobotStatusNosql(ctx: any, filter: RobotStatusFilter): Promise<RobotStatus[]> {
    return this.robotStatusUsecase.fetch(ctx, filter);
  }
  
  async addRobotStatusNosql(ctx: any, filter: RobotStatusFilter, arg: RobotStatus): Promise<number> {
    return this.robotStatusUsecase.add(ctx, filter, arg);
  }
  
  // CustomLog methods
  async getCustomLogNosql(ctx: any, filter: CustomLogFilter): Promise<CustomLog[]> {
    return this.customLogUsecase.fetch(ctx, filter);
  }
  
  async addCustomLogNosql(ctx: any, filter: CustomLogFilter, arg: CustomLog): Promise<number> {
    return this.customLogUsecase.add(ctx, filter, arg);
  }
  
  // MJob methods
  async getMJobNosql(ctx: any, filter: MJobFilter): Promise<MJob[]> {
    return this.mjobUsecase.fetch(ctx, filter);
  }
  
  async saveMJobNosql(ctx: any, filter: MJobFilter, arg: MJob): Promise<MJob> {
    return this.mjobUsecase.add(ctx, filter, arg);
  }
  
  async updateMJobNosql(ctx: any, filter: MJobFilter, arg: MJob): Promise<MJob> {
    return this.mjobUsecase.update(ctx, filter, arg);
  }
  
  async deleteMJobNosql(ctx: any, filter: MJobFilter, arg: MJob): Promise<number> {
    return this.mjobUsecase.delete(ctx, filter, arg);
  }
}
