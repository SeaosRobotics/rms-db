import { MongoClient } from 'mongodb';
import * as grpc from '@grpc/grpc-js';
import logger from '../../tools/logger/logger';
import { BackendApiUsecaseImpl } from './backend_api_usecase';
import {
  GetLocationRequest,
  GetLocationResponse,
  Location,
  Sector,
  GetJobRequest,
  GetJobResponse,
  AddJobRequest,
  AddJobResponse,
  UpdateJobRequest,
  UpdateJobResponse,
  DeleteJobRequest,
  DeleteJobResponse,
} from './backend_api_domain';
import { LocationFilter } from '../../components/location/location_domain';
import { SectorFilter } from '../../components/sector/sector_domain';
import { Map, Robot, Goal, Tag, Pipe, Area, Job as ApiJob, JobTask as ApiJobTask, SubTask as ApiSubTask, Grab as ApiGrab } from './backend_api_domain';
import { Job as JobEntity, JobTask as JobTaskEntity, SubTask as SubTaskEntity, Grab as GrabEntity } from '../../components/job/job_domain';
import { Pipe as PipeEntity } from '../../components/pipe/pipe_domain';
import { Tag as TagEntity } from '../../components/tag/tag_domain';
import { Goal as GoalEntity } from '../../components/goal/goal_domain';
import { Area as AreaEntity } from '../../components/area/area_domain';

export class BackendApiServiceImpl {
  private backendApiUsecase: BackendApiUsecaseImpl;
  
  constructor(
    private conn: MongoClient,
    private dbName: string,
    private timeout: number,
    private log: typeof logger
  ) {
    this.backendApiUsecase = new BackendApiUsecaseImpl(conn, dbName, timeout, log);
  }

  private mapPipe(apiPipe?: Pipe): PipeEntity | undefined {
    if (!apiPipe) return undefined;
    return {
      id: apiPipe.id,
      sector_id: apiPipe.sector_id,
      location_id: apiPipe.location_id,
      name: apiPipe.name,
      closed: apiPipe.closed,
      path: apiPipe.path ?? [],
    };
  }

  private mapJobTask(apiTask: ApiJobTask): JobTaskEntity {
    return {
      id: apiTask.id,
      name: apiTask.name,
      text: apiTask.text,
      explanation: apiTask.explanation,
      label: apiTask.label,
      placeholder: apiTask.placeholder,
      show: apiTask.show,
      number: apiTask.number,
      array: apiTask.array,
      goal_id: apiTask.goal_id,
      goal: apiTask.goal as unknown as GoalEntity | undefined,
      pipe_id: apiTask.pipe_id,
      pipe: this.mapPipe(apiTask.pipe),
      range: apiTask.range,
      tag: apiTask.tag as unknown as TagEntity | undefined,
      tag_id: apiTask.tag_id,
      boolean: apiTask.boolean,
      area_id: apiTask.area_id,
      area: apiTask.area as unknown as AreaEntity | undefined,
      grab: apiTask.grab as unknown as GrabEntity | undefined,
      sub_tasks: apiTask.sub_tasks?.map(st => this.mapSubTask(st)),
      options: apiTask.options as unknown as JobEntity[] | undefined,
      switch: apiTask.switch as any,
      status: apiTask.status,
      message: apiTask.message,
      started: apiTask.started,
      finished: apiTask.finished,
      break: apiTask.break,
      skip: apiTask.skip,
    };
  }

  private mapSubTask(api: ApiSubTask): SubTaskEntity {
    return {
      sub_id: api.sub_id,
      name: api.name,
      text: api.text,
      explanation: api.explanation,
      label: api.label,
      placeholder: api.placeholder,
      show: api.show,
      number: api.number,
      array: api.array,
      goal_id: api.goal_id,
      goal: api.goal as unknown as GoalEntity | undefined,
      pipe_id: api.pipe_id,
      pipe: this.mapPipe(api.pipe),
      range: api.range,
      tag: api.tag as unknown as TagEntity | undefined,
      tag_id: api.tag_id,
      boolean: api.boolean,
      area_id: api.area_id,
      area: api.area as unknown as AreaEntity | undefined,
      grab: api.grab as unknown as GrabEntity | undefined,
      status: api.status,
      message: api.message,
      started: api.started,
      finished: api.finished,
      break: api.break,
      skip: api.skip,
    };
  }

  private mapJob(apiJob: ApiJob): JobEntity {
    return {
      job_id: apiJob.job_id,
      job_name: apiJob.job_name,
      job_order: apiJob.job_order,
      job_status: apiJob.job_status,
      job_message: apiJob.job_message,
      location_id: apiJob.location_id,
      sector_id: apiJob.sector_id,
      robot_id: apiJob.robot_id,
      job_tasks: apiJob.job_tasks?.map(t => this.mapJobTask(t)),
      job_started: apiJob.job_started,
      job_finished: apiJob.job_finished,
      create_user: apiJob.create_user,
      create_date: apiJob.create_date,
      update_user: apiJob.update_user,
      update_date: apiJob.update_date,
      update_count: apiJob.update_count,
      job_lock: apiJob.job_lock,
      job_unlock: apiJob.job_unlock,
    };
  }
  
  // Location methods
  getLocation = async (
    call: grpc.ServerUnaryCall<GetLocationRequest, GetLocationResponse>,
    callback: grpc.sendUnaryData<GetLocationResponse>
  ) => {
    try {
      const req = call.request;
      const filter: LocationFilter = {
        databaseName: this.dbName,
        collectionName: 'm_location',
        clientId: req.client_id,
      };
      
      const locations = await this.backendApiUsecase.getLocationNosql(call, filter);
      
      // Populate nested data for each location
      const populatedLocations: Location[] = [];
      
      for (const loc of locations) {
        // Fetch sectors for this location
        const sectorFilter: SectorFilter = {
          databaseName: this.dbName,
          collectionName: 'm_sector',
          locationId: loc.location_id,
          sectorId: 0,
        };
        
        const sectors = await this.backendApiUsecase.getSectorNosql(call, sectorFilter);
        
        // Populate each sector with maps, robots, goals, tags, pipes, areas, and jobs
        const populatedSectors: Sector[] = [];
        
        for (const sectorData of sectors) {
          // Fetch map
          const mapFilter = {
            databaseName: this.dbName,
            collectionName: 'm_map',
            mapId: sectorData.map_id || 0,
            sectorId: sectorData.sector_id,
            locationId: loc.location_id,
          };
          const maps = await this.backendApiUsecase.getMapNosql(call, mapFilter);
          const map = maps.length > 0 ? maps[0] : undefined;
          
          // Fetch robots
          const robotFilter = {
            databaseName: this.dbName,
            collectionName: 'm_robot',
            locationId: loc.location_id,
            sectorId: sectorData.sector_id,
          };
          const robots = await this.backendApiUsecase.getRobotsNosql(call, robotFilter);
          
          // Fetch goals
          const goalFilter = {
            databaseName: this.dbName,
            collectionName: 'm_goal',
            locationId: loc.location_id,
            sectorId: sectorData.sector_id,
            goalId: 0,
          };
          const goals = await this.backendApiUsecase.getGoalNosql(call, goalFilter);
          
          // Fetch tags
          const tagFilter = {
            databaseName: this.dbName,
            collectionName: 'm_tag',
            locationId: loc.location_id,
            sectorId: sectorData.sector_id,
            tagId: 0,
          };
          const tags = await this.backendApiUsecase.getTagNosql(call, tagFilter);
          
          // Fetch pipes
          const pipeFilter = {
            databaseName: this.dbName,
            collectionName: 'm_pipe',
            locationId: loc.location_id,
            sectorId: sectorData.sector_id,
            pipeId: 0,
          };
          const pipes = await this.backendApiUsecase.getPipeNosql(call, pipeFilter);
          
          // Fetch areas
          const areaFilter = {
            databaseName: this.dbName,
            collectionName: 'm_area',
            location: loc.location_id,
            sector: sectorData.sector_id,
            id: 0,
          };
          const areas = await this.backendApiUsecase.getAreaNosql(call, areaFilter);
          
          // Fetch mjobs
          const mjobFilter = {
            databaseName: this.dbName,
            collectionName: 'm_job',
            locationId: loc.location_id,
            sectorId: sectorData.sector_id,
            jobId: 0,
          };
          const mjobs = await this.backendApiUsecase.getMJobNosql(call, mjobFilter);
          
          // Build populated sector
          const populatedSector: Sector = {
            sector_id: sectorData.sector_id,
            sector_name: sectorData.sector_name,
            map_id: sectorData.map_id,
            map,
            robots,
            goals,
            tags,
            pipes,
            jobs: mjobs as any,
            areas,
            location_id: sectorData.location_id,
            user_id: sectorData.user_id,
            orchestration_bridge: sectorData.orchestration_bridge,
          };
          
          populatedSectors.push(populatedSector);
        }
        
        populatedLocations.push({
          location_id: loc.location_id,
          client_id: loc.client_id,
          location_name: loc.location_name,
          sectors: populatedSectors,
          user_id: loc.user_id,
        });
      }
      
      callback(null, {
        locations: populatedLocations,
      });
    } catch (error) {
      this.log.error(`GetLocation error: ${error}`);
      callback({
        code: grpc.status.INTERNAL,
        message: String(error),
      });
    }
  };
  
  addLocation = async (
    call: grpc.ServerUnaryCall<any, any>,
    callback: grpc.sendUnaryData<any>
  ) => {
    try {
      const req = call.request;
      const filter: LocationFilter = {
        databaseName: this.dbName,
        collectionName: 'm_location',
        clientId: req.client_id,
      };
      
      const location: Location = {
        location_id: 0,
        client_id: req.client_id,
        location_name: req.location_name,
        user_id: req.user_id,
      };
      
      const result = await this.backendApiUsecase.addLocation(call, filter, location);
      
      callback(null, {
        location_id: result.locationId,
        location_name: result.locationName,
        error: 0,
        user_id: req.user_id,
      });
    } catch (error) {
      this.log.error(`AddLocation error: ${error}`);
      callback({
        code: grpc.status.INTERNAL,
        message: String(error),
      });
    }
  };
  
  updateLocation = async (
    call: grpc.ServerUnaryCall<any, any>,
    callback: grpc.sendUnaryData<any>
  ) => {
    try {
      const req = call.request;
      const filter: LocationFilter = {
        databaseName: this.dbName,
        collectionName: 'm_location',
        clientId: 0, // Not used for update
      };
      
      const location: Location = {
        location_id: req.location_id,
        client_id: 0,
        location_name: req.location_name,
        user_id: req.user_id,
      };
      
      const result = await this.backendApiUsecase.updateLocation(call, filter, location);
      
      callback(null, {
        location_id: result.locationId,
        location_name: result.locationName,
        error: 0,
        user_id: req.user_id,
      });
    } catch (error) {
      this.log.error(`UpdateLocation error: ${error}`);
      callback({
        code: grpc.status.INTERNAL,
        message: String(error),
      });
    }
  };
  
  deleteLocation = async (
    call: grpc.ServerUnaryCall<any, any>,
    callback: grpc.sendUnaryData<any>
  ) => {
    try {
      const req = call.request;
      const filter: LocationFilter = {
        databaseName: this.dbName,
        collectionName: 'm_location',
        clientId: 0,
      };
      
      const location: Location = {
        location_id: req.location_id,
        client_id: 0,
        location_name: '',
        user_id: 0,
      };
      
      const locationId = await this.backendApiUsecase.deleteLocation(call, filter, location);
      
      callback(null, {
        location_id: locationId,
        user_id: 0,
        error: 0,
      });
    } catch (error) {
      this.log.error(`DeleteLocation error: ${error}`);
      callback({
        code: grpc.status.INTERNAL,
        message: String(error),
      });
    }
  };
  
  // Sector methods
  fetchSector = async (
    call: grpc.ServerUnaryCall<any, any>,
    callback: grpc.sendUnaryData<any>
  ) => {
    try {
      const req = call.request;
      const filter: SectorFilter = {
        databaseName: this.dbName,
        collectionName: 'm_sector',
        locationId: req.location_id,
        sectorId: req.sector_id,
      };
      
      const sector = await this.backendApiUsecase.fetchSector(call, filter);
      
      if (!sector) {
        callback(null, { sector: null });
        return;
      }
      
      callback(null, {
        sector: {
          sector_id: sector.sector_id,
          sector_name: sector.sector_name,
          map_id: sector.map_id,
          location_id: sector.location_id,
          user_id: sector.user_id,
          orchestration_bridge: sector.orchestration_bridge || [],
        },
      });
    } catch (error) {
      this.log.error(`FetchSector error: ${error}`);
      callback({
        code: grpc.status.INTERNAL,
        message: String(error),
      });
    }
  };
  
  addSector = async (
    call: grpc.ServerUnaryCall<any, any>,
    callback: grpc.sendUnaryData<any>
  ) => {
    try {
      const req = call.request;
      const filter: SectorFilter = {
        databaseName: this.dbName,
        collectionName: 'm_sector',
        locationId: req.location_id,
        sectorId: req.sector_id || 0,
      };
      
      const sector: Sector = {
        sector_id: req.sector_id || 0,
        sector_name: req.sector_name,
        location_id: req.location_id,
        user_id: req.user_id,
      };
      
      const result = await this.backendApiUsecase.addSector(call, filter, sector);
      
      callback(null, {
        location_id: req.location_id,
        sector_id: result.sectorId,
        sector_name: result.sectorName,
        error: 0,
        user_id: req.user_id,
      });
    } catch (error) {
      this.log.error(`AddSector error: ${error}`);
      callback({
        code: grpc.status.INTERNAL,
        message: String(error),
      });
    }
  };
  
  updateSector = async (
    call: grpc.ServerUnaryCall<any, any>,
    callback: grpc.sendUnaryData<any>
  ) => {
    try {
      const req = call.request;
      const filter: SectorFilter = {
        databaseName: this.dbName,
        collectionName: 'm_sector',
        locationId: req.location_id,
        sectorId: req.sector_id,
      };
      
      const sector: Sector = {
        sector_id: req.sector_id,
        sector_name: req.sector_name,
        location_id: req.location_id,
        user_id: req.user_id,
      };
      
      const result = await this.backendApiUsecase.updateSector(call, filter, sector);
      
      callback(null, {
        location_id: req.location_id,
        sector_id: result.sectorId,
        sector_name: result.sectorName,
        error: 0,
        user_id: req.user_id,
      });
    } catch (error) {
      this.log.error(`UpdateSector error: ${error}`);
      callback({
        code: grpc.status.INTERNAL,
        message: String(error),
      });
    }
  };
  
  deleteSector = async (
    call: grpc.ServerUnaryCall<any, any>,
    callback: grpc.sendUnaryData<any>
  ) => {
    try {
      const req = call.request;
      const filter: SectorFilter = {
        databaseName: this.dbName,
        collectionName: 'm_sector',
        locationId: req.location_id,
        sectorId: req.sector_id,
      };
      
      const sector: Sector = {
        sector_id: req.sector_id,
        sector_name: req.sector_name,
        location_id: req.location_id,
        user_id: req.user_id,
      };
      
      const result = await this.backendApiUsecase.deleteSector(call, filter, sector);
      
      callback(null, {
        location_id: req.location_id,
        sector_id: result.sectorId,
        sector_name: result.sectorName,
        error: 0,
        user_id: req.user_id,
      });
    } catch (error) {
      this.log.error(`DeleteSector error: ${error}`);
      callback({
        code: grpc.status.INTERNAL,
        message: String(error),
      });
    }
  };
  
  // Job methods
  getJob = async (
    call: grpc.ServerUnaryCall<GetJobRequest, GetJobResponse>,
    callback: grpc.sendUnaryData<GetJobResponse>
  ) => {
    try {
      const req = call.request;
      
      // Convert dates to timestamps
      let jobStarted = 0;
      let jobFinished = 0;
      
      if (req.job_from_date) {
        const date = new Date(req.job_from_date);
        jobStarted = Math.floor(date.getTime() / 1000);
      }
      
      if (req.job_to_date) {
        const date = new Date(req.job_to_date);
        date.setHours(23, 59, 59, 0);
        jobFinished = Math.floor(date.getTime() / 1000);
      }
      
      const filter = {
        databaseName: this.dbName,
        collectionName: 't_job',
        locationId: req.location_id,
        sectorId: req.sector_id,
        robotId: req.robot_id,
        jobId: req.job_id,
        jobStatus: req.job_status,
        jobStarted,
        jobFinished,
        fetchOffset: req.fetch_offset,
        fetchLimit: req.fetch_limit,
        filterType: req.filter_type,
        sortType: req.sort_type,
        orderType: req.order_type,
      };
      
      const jobs = await this.backendApiUsecase.getJobNosql(call, filter);
      
      callback(null, { jobs });
    } catch (error) {
      this.log.error(`GetJob error: ${error}`);
      callback({
        code: grpc.status.INTERNAL,
        message: String(error),
      });
    }
  };
  
  addJob = async (
    call: grpc.ServerUnaryCall<AddJobRequest, AddJobResponse>,
    callback: grpc.sendUnaryData<AddJobResponse>
  ) => {
    try {
      const req = call.request;
      const filter = {
        databaseName: this.dbName,
        collectionName: 't_job',
        locationId: 0,
        sectorId: 0,
        robotId: 0,
        jobId: 0,
        jobStatus: 0,
        jobStarted: 0,
        jobFinished: 0,
        fetchOffset: 0,
        fetchLimit: 0,
        filterType: 0,
        sortType: 0,
        orderType: 0,
      };
      
      const mappedJob = this.mapJob(req.job as unknown as ApiJob);
      const jobId = await this.backendApiUsecase.addJobNosql(call, filter, mappedJob);
      
      callback(null, {
        result: jobId > 0 ? 0 : -1,
        job_id: jobId,
      });
    } catch (error) {
      this.log.error(`AddJob error: ${error}`);
      callback(null, {
        result: -1,
        job_id: 0,
      });
    }
  };
  
  updateJob = async (
    call: grpc.ServerUnaryCall<UpdateJobRequest, UpdateJobResponse>,
    callback: grpc.sendUnaryData<UpdateJobResponse>
  ) => {
    try {
      const req = call.request;
      const filter = {
        databaseName: this.dbName,
        collectionName: 't_job',
        locationId: 0,
        sectorId: 0,
        robotId: 0,
        jobId: 0,
        jobStatus: 0,
        jobStarted: 0,
        jobFinished: 0,
        fetchOffset: 0,
        fetchLimit: 0,
        filterType: 0,
        sortType: 0,
        orderType: 0,
      };
      
      const mappedJob = this.mapJob(req.job as unknown as ApiJob);
      await this.backendApiUsecase.updateJobNosql(call, filter, mappedJob);
      
      callback(null, {
        result: 0,
        job_id: 0,
      });
    } catch (error) {
      this.log.error(`UpdateJob error: ${error}`);
      callback(null, {
        result: -1,
        job_id: 0,
      });
    }
  };
  
  deleteJob = async (
    call: grpc.ServerUnaryCall<DeleteJobRequest, DeleteJobResponse>,
    callback: grpc.sendUnaryData<DeleteJobResponse>
  ) => {
    try {
      const req = call.request;
      const filter = {
        databaseName: this.dbName,
        collectionName: 't_job',
        locationId: 0,
        sectorId: 0,
        robotId: 0,
        jobId: 0,
        jobStatus: 0,
        jobStarted: 0,
        jobFinished: 0,
        fetchOffset: 0,
        fetchLimit: 0,
        filterType: 0,
        sortType: 0,
        orderType: 0,
      };
      
      await this.backendApiUsecase.deleteJobNosql(call, filter, req.job_id);
      
      callback(null, { result: 0 });
    } catch (error) {
      this.log.error(`DeleteJob error: ${error}`);
      callback(null, { result: -1 });
    }
  };
  
  // Notification methods
  getNotification = async (call: any, callback: any) => {
    try {
      const req = call.request;
      
      let filterFromDate = 0;
      let filterToDate = 0;
      
      if (req.filter_from_date) {
        const date = new Date(req.filter_from_date);
        filterFromDate = Math.floor(date.getTime() / 1000);
      }
      
      if (req.filter_to_date) {
        const date = new Date(req.filter_to_date);
        date.setHours(23, 59, 59, 0);
        filterToDate = Math.floor(date.getTime() / 1000);
      }
      
      const filter = {
        databaseName: this.dbName,
        collectionName: 't_notification',
        locationId: req.location_id,
        sectorId: req.sector_id,
        robotId: 0,
        confirmDate: 0,
        filterFromDate,
        filterToDate,
        fetchOffset: req.fetch_offset || 0,
        fetchLimit: req.fetch_limit || 0,
        filterType: req.filter_type || 0,
        sortType: req.sort_type || 0,
        orderType: req.order_type || 0,
      };
      
      const notifications = await this.backendApiUsecase.getNotificationNosql(call, filter);
      
      callback(null, { notifications });
    } catch (error) {
      this.log.error(`GetNotification error: ${error}`);
      callback({ code: grpc.status.INTERNAL, message: String(error) });
    }
  };
  
  addNotification = async (call: any, callback: any) => {
    try {
      const req = call.request;
      const filter = {
        databaseName: this.dbName,
        collectionName: 't_notification',
        locationId: 0,
        sectorId: 0,
        robotId: 0,
        confirmDate: 0,
        filterFromDate: 0,
        filterToDate: 0,
        fetchOffset: 0,
        fetchLimit: 0,
        filterType: 0,
        sortType: 0,
        orderType: 0,
      };
      
      const notificationId = await this.backendApiUsecase.addNotificationNosql(call, filter, req.notification);
      
      callback(null, {
        result: notificationId > 0 ? 0 : -1,
        notification_id: notificationId,
      });
    } catch (error) {
      this.log.error(`AddNotification error: ${error}`);
      callback(null, { result: -1, notification_id: 0 });
    }
  };
  
  updateNotification = async (call: any, callback: any) => {
    try {
      const req = call.request;
      const filter = {
        databaseName: this.dbName,
        collectionName: 't_notification',
        locationId: req.location_id,
        sectorId: req.sector_id,
        robotId: 0,
        confirmDate: 0,
        filterFromDate: 0,
        filterToDate: 0,
        fetchOffset: 0,
        fetchLimit: 0,
        filterType: 0,
        sortType: 0,
        orderType: 0,
      };
      
      const notification = { confirm_date: req.confirm_date || Date.now() / 1000 };
      await this.backendApiUsecase.updateNotificationNosql(call, filter, notification as any);
      
      callback(null, { result: 0 });
    } catch (error) {
      this.log.error(`UpdateNotification error: ${error}`);
      callback(null, { result: -1 });
    }
  };
  
  // Localization methods
  getLocalization = async (call: any, callback: any) => {
    try {
      const req = call.request;
      
      let filterFromDate = 0;
      let filterToDate = 0;
      
      if (req.filter_from_date) {
        const date = new Date(req.filter_from_date);
        filterFromDate = Math.floor(date.getTime() / 1000);
      }
      
      if (req.filter_to_date) {
        const date = new Date(req.filter_to_date);
        date.setHours(23, 59, 59, 0);
        filterToDate = Math.floor(date.getTime() / 1000);
      }
      
      const filter = {
        databaseName: this.dbName,
        collectionName: 't_localization',
        locationId: req.location_id,
        sectorId: req.sector_id,
        robotId: 0,
        filterFromDate,
        filterToDate,
        fetchOffset: req.fetch_offset || 0,
        fetchLimit: req.fetch_limit || 0,
        filterType: req.filter_type || 0,
        sortType: req.sort_type || 0,
        orderType: req.order_type || 0,
      };
      
      const localizations = await this.backendApiUsecase.getLocalizationNosql(call, filter);
      
      callback(null, { localizations });
    } catch (error) {
      this.log.error(`GetLocalization error: ${error}`);
      callback({ code: grpc.status.INTERNAL, message: String(error) });
    }
  };
  
  addLocalization = async (call: any, callback: any) => {
    try {
      const req = call.request;
      const filter = {
        databaseName: this.dbName,
        collectionName: 't_localization',
        locationId: 0,
        sectorId: 0,
        robotId: 0,
        filterFromDate: 0,
        filterToDate: 0,
        fetchOffset: 0,
        fetchLimit: 0,
        filterType: 0,
        sortType: 0,
        orderType: 0,
      };
      
      const localizationId = await this.backendApiUsecase.addLocalizationNosql(call, filter, req.localization);
      
      callback(null, {
        result: localizationId > 0 ? 0 : -1,
        localization_id: localizationId,
      });
    } catch (error) {
      this.log.error(`AddLocalization error: ${error}`);
      callback(null, { result: -1, localization_id: 0 });
    }
  };
  
  // RobotStatus methods
  getRobotStatus = async (call: any, callback: any) => {
    try {
      const req = call.request;
      
      let filterFromDate = 0;
      let filterToDate = 0;
      
      if (req.filter_from_date) {
        const date = new Date(req.filter_from_date);
        filterFromDate = Math.floor(date.getTime() / 1000);
      }
      
      if (req.filter_to_date) {
        const date = new Date(req.filter_to_date);
        date.setHours(23, 59, 59, 0);
        filterToDate = Math.floor(date.getTime() / 1000);
      }
      
      const filter = {
        databaseName: this.dbName,
        collectionName: 't_robot_status',
        locationId: req.location_id,
        sectorId: req.sector_id,
        robotId: 0,
        filterFromDate,
        filterToDate,
        fetchOffset: req.fetch_offset || 0,
        fetchLimit: req.fetch_limit || 0,
        filterType: req.filter_type || 0,
        sortType: req.sort_type || 0,
        orderType: req.order_type || 0,
      };
      
      const robotStatuses = await this.backendApiUsecase.getRobotStatusNosql(call, filter);
      
      callback(null, { robot_statuses: robotStatuses });
    } catch (error) {
      this.log.error(`GetRobotStatus error: ${error}`);
      callback({ code: grpc.status.INTERNAL, message: String(error) });
    }
  };
  
  addRobotStatus = async (call: any, callback: any) => {
    try {
      const req = call.request;
      const filter = {
        databaseName: this.dbName,
        collectionName: 't_robot_status',
        locationId: 0,
        sectorId: 0,
        robotId: 0,
        filterFromDate: 0,
        filterToDate: 0,
        fetchOffset: 0,
        fetchLimit: 0,
        filterType: 0,
        sortType: 0,
        orderType: 0,
      };
      
      const robotStatusId = await this.backendApiUsecase.addRobotStatusNosql(call, filter, req.robot_status);
      
      callback(null, {
        result: robotStatusId > 0 ? 0 : -1,
        robot_status_id: robotStatusId,
      });
    } catch (error) {
      this.log.error(`AddRobotStatus error: ${error}`);
      callback(null, { result: -1, robot_status_id: 0 });
    }
  };
  
  // CustomLog methods
  getCustomLog = async (call: any, callback: any) => {
    try {
      const req = call.request;
      
      let filterFromDate = 0;
      let filterToDate = 0;
      
      if (req.filter_from_date) {
        const date = new Date(req.filter_from_date);
        filterFromDate = Math.floor(date.getTime() / 1000);
      }
      
      if (req.filter_to_date) {
        const date = new Date(req.filter_to_date);
        date.setHours(23, 59, 59, 0);
        filterToDate = Math.floor(date.getTime() / 1000);
      }
      
      const filter = {
        databaseName: this.dbName,
        collectionName: 't_custom_log',
        locationId: req.location_id,
        sectorId: req.sector_id,
        robotId: 0,
        filterFromDate,
        filterToDate,
        fetchOffset: req.fetch_offset || 0,
        fetchLimit: req.fetch_limit || 0,
        filterType: req.filter_type || 0,
        sortType: req.sort_type || 0,
        orderType: req.order_type || 0,
      };
      
      const customLogs = await this.backendApiUsecase.getCustomLogNosql(call, filter);
      
      callback(null, { custom_logs: customLogs });
    } catch (error) {
      this.log.error(`GetCustomLog error: ${error}`);
      callback({ code: grpc.status.INTERNAL, message: String(error) });
    }
  };
  
  addCustomLog = async (call: any, callback: any) => {
    try {
      const req = call.request;
      const filter = {
        databaseName: this.dbName,
        collectionName: 't_custom_log',
        locationId: 0,
        sectorId: 0,
        robotId: 0,
        filterFromDate: 0,
        filterToDate: 0,
        fetchOffset: 0,
        fetchLimit: 0,
        filterType: 0,
        sortType: 0,
        orderType: 0,
      };
      
      const customLogId = await this.backendApiUsecase.addCustomLogNosql(call, filter, req.custom_log);
      
      callback(null, {
        result: customLogId > 0 ? 0 : -1,
        custom_log_id: customLogId,
      });
    } catch (error) {
      this.log.error(`AddCustomLog error: ${error}`);
      callback(null, { result: -1, custom_log_id: 0 });
    }
  };
  
  // User methods
  getUser = async (call: any, callback: any) => {
    try {
      const req = call.request;
      const filter = {
        databaseName: this.dbName,
        collectionName: 'm_user',
        userId: req.user_id || 0,
        userName: req.user_name || '',
        fetchOffset: req.fetch_offset || 0,
        fetchLimit: req.fetch_limit || 0,
        filterType: req.filter_type || 0,
        sortType: req.sort_type || 0,
        orderType: req.order_type || 0,
      };
      
      const users = await this.backendApiUsecase.getUserNosql(call, filter);
      
      callback(null, { users });
    } catch (error) {
      this.log.error(`GetUser error: ${error}`);
      callback({ code: grpc.status.INTERNAL, message: String(error) });
    }
  };
  
  addUser = async (call: any, callback: any) => {
    try {
      const req = call.request;
      const filter = {
        databaseName: this.dbName,
        collectionName: 'm_user',
        userId: 0,
        userName: '',
        fetchOffset: 0,
        fetchLimit: 0,
        filterType: 0,
        sortType: 0,
        orderType: 0,
      };
      
      const userId = await this.backendApiUsecase.addUserNosql(call, filter, req.user);
      
      callback(null, {
        result: userId > 0 ? 0 : -1,
        user_id: userId,
      });
    } catch (error) {
      this.log.error(`AddUser error: ${error}`);
      callback(null, { result: -1, user_id: 0 });
    }
  };
  
  updateUser = async (call: any, callback: any) => {
    try {
      const req = call.request;
      const filter = {
        databaseName: this.dbName,
        collectionName: 'm_user',
        userId: 0,
        userName: '',
        fetchOffset: 0,
        fetchLimit: 0,
        filterType: 0,
        sortType: 0,
        orderType: 0,
      };
      
      await this.backendApiUsecase.updateUserNosql(call, filter, req.user);
      
      callback(null, { result: 0, user_id: 0 });
    } catch (error) {
      this.log.error(`UpdateUser error: ${error}`);
      callback(null, { result: -1, user_id: 0 });
    }
  };
  
  deleteUser = async (call: any, callback: any) => {
    try {
      const req = call.request;
      const filter = {
        databaseName: this.dbName,
        collectionName: 'm_user',
        userId: 0,
        userName: '',
        fetchOffset: 0,
        fetchLimit: 0,
        filterType: 0,
        sortType: 0,
        orderType: 0,
      };
      
      await this.backendApiUsecase.deleteUserNosql(call, filter, req.user_id);
      
      callback(null, { result: 0 });
    } catch (error) {
      this.log.error(`DeleteUser error: ${error}`);
      callback(null, { result: -1 });
    }
  };
  
  getUsers = async (call: any, callback: any) => {
    try {
      const filter = {
        databaseName: this.dbName,
        collectionName: 'm_user',
        userId: 0,
        userName: '',
        fetchOffset: 0,
        fetchLimit: 0,
        filterType: 0,
        sortType: 0,
        orderType: 0,
      };
      
      const users = await this.backendApiUsecase.getUsersNosql(call, filter);
      
      callback(null, { users });
    } catch (error) {
      this.log.error(`GetUsers error: ${error}`);
      callback({ code: grpc.status.INTERNAL, message: String(error) });
    }
  };
  
  
  // Robot methods
  getRobots = async (call: any, callback: any) => {
    try {
      const req = call.request;
      const filter = {
        databaseName: this.dbName,
        collectionName: 'm_robot',
        locationId: req.location_id,
        sectorId: req.sector_id,
      };
      
      const robots = await this.backendApiUsecase.getRobotsNosql(call, filter);
      
      callback(null, { robots });
    } catch (error) {
      this.log.error(`GetRobots error: ${error}`);
      callback({ code: grpc.status.INTERNAL, message: String(error) });
    }
  };
  
  updateRobot = async (call: any, callback: any) => {
    try {
      const req = call.request;
      const filter = {
        databaseName: this.dbName,
        collectionName: 'm_robot',
        locationId: req.location_id,
        sectorId: req.sector_id,
      };
      
      const robot = {
        robot_id: req.robot.robot_id,
        location_id: req.location_id,
        sector_id: req.sector_id,
        robot_name: req.robot.robot_name,
        robot_type: req.robot.robot_type,
        status: req.robot.status,
        availableUp: req.robot.availableUp,
        availableDown: req.robot.availableDown,
        pose: req.robot.pose,
        battery: req.robot.battery,
        slam: req.robot.slam,
        dock_id: req.robot.dock_id,
        host: req.robot.host,
        port: req.robot.port,
        user_id: 0,
      };
      
      await this.backendApiUsecase.updateRobotNosql(call, filter, robot);
      
      callback(null, { result: 1 });
    } catch (error) {
      this.log.error(`UpdateRobot error: ${error}`);
      callback(null, { result: 0 });
    }
  };
  
  addRobot = async (call: any, callback: any) => {
    try {
      const req = call.request;
      const filter = {
        databaseName: this.dbName,
        collectionName: 'm_robot',
        locationId: req.location_id,
        sectorId: req.sector_id,
      };
      
      const robot = {
        robot_id: req.robot.robot_id,
        location_id: req.location_id,
        sector_id: req.sector_id,
        robot_name: req.robot.robot_name,
        robot_type: req.robot.robot_type,
        status: req.robot.status,
        availableUp: req.robot.availableUp,
        availableDown: req.robot.availableDown,
        pose: req.robot.pose,
        battery: req.robot.battery,
        slam: req.robot.slam,
        dock_id: req.robot.dock_id,
        host: req.robot.host,
        port: req.robot.port,
        user_id: 0,
      };
      
      await this.backendApiUsecase.addRobotNosql(call, filter, robot);
      
      callback(null, {
        result: 1,
        robot_id: req.robot.robot_id,
      });
    } catch (error) {
      this.log.error(`AddRobot error: ${error}`);
      const robotId = call.request?.robot?.robot_id || 0;
      callback(null, {
        result: 0,
        robot_id: robotId,
      });
    }
  };
  
  deleteRobot = async (call: any, callback: any) => {
    try {
      const req = call.request;
      const filter = {
        databaseName: this.dbName,
        collectionName: 'm_robot',
        locationId: req.location_id,
        sectorId: req.sector_id,
      };
      
      await this.backendApiUsecase.deleteRobotNosql(call, filter, req.robot_id);
      
      callback(null, { result: 1 });
    } catch (error) {
      this.log.error(`DeleteRobot error: ${error}`);
      callback(null, { result: 0 });
    }
  };
  
  // UserWorkspace methods
  getUserWorkspace = async (call: any, callback: any) => {
    try {
      const req = call.request;
      const filter = {
        databaseName: this.dbName,
        collectionName: 'm_userworkspace',
        userId: req.user_id,
        locationId: 0,
      };
      
      const userWorkspaces = await this.backendApiUsecase.getUserWorkspaceNosql(call, filter);
      
      callback(null, { user_workspaces: userWorkspaces });
    } catch (error) {
      this.log.error(`GetUserWorkspace error: ${error}`);
      callback({ code: grpc.status.INTERNAL, message: String(error) });
    }
  };
  
  saveWorkspaceLocation = async (call: any, callback: any) => {
    try {
      const req = call.request;
      const filter = {
        databaseName: this.dbName,
        collectionName: 'm_userworkspace',
        userId: req.user_id,
        locationId: 0,
      };
      
      const location = {
        location_id: req.location_id,
        location_name: req.location_name,
        user_sectors: [],
      };
      
      const userWorkspaces = await this.backendApiUsecase.addUserWorkspaceLocation(call, filter, location);
      
      callback(null, { user_workspaces: userWorkspaces });
    } catch (error) {
      this.log.error(`SaveWorkspaceLocation error: ${error}`);
      callback({ code: grpc.status.INTERNAL, message: String(error) });
    }
  };
  
  updateWorkspaceLocation = async (call: any, callback: any) => {
    try {
      const req = call.request;
      const filter = {
        databaseName: this.dbName,
        collectionName: 'm_userworkspace',
        userId: req.user_id,
        locationId: 0,
      };
      
      const location = {
        location_id: req.location_id,
        location_name: req.location_name,
        user_sectors: [],
      };
      
      const userWorkspaces = await this.backendApiUsecase.updateUserWorkspaceLocation(call, filter, location);
      
      callback(null, { user_workspaces: userWorkspaces });
    } catch (error) {
      this.log.error(`UpdateWorkspaceLocation error: ${error}`);
      callback({ code: grpc.status.INTERNAL, message: String(error) });
    }
  };
  
  deleteWorkspaceLocation = async (call: any, callback: any) => {
    try {
      const req = call.request;
      const filter = {
        databaseName: this.dbName,
        collectionName: 'm_userworkspace',
        userId: req.user_id,
        locationId: 0,
      };
      
      const location = {
        location_id: req.location_id,
        location_name: '',
        user_sectors: [],
      };
      
      const userWorkspaces = await this.backendApiUsecase.deleteUserWorkspaceLocation(call, filter, location);
      
      callback(null, { user_workspaces: userWorkspaces });
    } catch (error) {
      this.log.error(`DeleteWorkspaceLocation error: ${error}`);
      callback({ code: grpc.status.INTERNAL, message: String(error) });
    }
  };
  
  saveWorkspaceSector = async (call: any, callback: any) => {
    try {
      const req = call.request;
      const filter = {
        databaseName: this.dbName,
        collectionName: 'm_userworkspace',
        userId: req.user_id,
        locationId: req.location_id,
      };
      
      const sector = {
        sector_id: req.sector_id,
        sector_name: req.sector_name,
      };
      
      const userWorkspaces = await this.backendApiUsecase.addUserWorkspaceSector(call, filter, sector);
      
      callback(null, { user_workspaces: userWorkspaces });
    } catch (error) {
      this.log.error(`SaveWorkspaceSector error: ${error}`);
      callback({ code: grpc.status.INTERNAL, message: String(error) });
    }
  };
  
  updateWorkspaceSector = async (call: any, callback: any) => {
    try {
      const req = call.request;
      const filter = {
        databaseName: this.dbName,
        collectionName: 'm_userworkspace',
        userId: req.user_id,
        locationId: req.location_id,
      };
      
      const sector = {
        sector_id: req.sector_id,
        sector_name: req.sector_name,
      };
      
      const userWorkspaces = await this.backendApiUsecase.updateUserWorkspaceSector(call, filter, sector);
      
      callback(null, { user_workspaces: userWorkspaces });
    } catch (error) {
      this.log.error(`UpdateWorkspaceSector error: ${error}`);
      callback({ code: grpc.status.INTERNAL, message: String(error) });
    }
  };
  
  deleteWorkspaceSector = async (call: any, callback: any) => {
    try {
      const req = call.request;
      const filter = {
        databaseName: this.dbName,
        collectionName: 'm_userworkspace',
        userId: req.user_id,
        locationId: req.location_id,
      };
      
      const sector = {
        sector_id: req.sector_id,
        sector_name: '',
      };
      
      const userWorkspaces = await this.backendApiUsecase.deleteUserWorkspaceSector(call, filter, sector);
      
      callback(null, { user_workspaces: userWorkspaces });
    } catch (error) {
      this.log.error(`DeleteWorkspaceSector error: ${error}`);
      callback({ code: grpc.status.INTERNAL, message: String(error) });
    }
  };
  
  // Pipe methods
  getPipes = async (call: any, callback: any) => {
    try {
      const req = call.request;
      const filter = {
        databaseName: this.dbName,
        collectionName: 'm_pipe',
        locationId: req.location_id,
        sectorId: req.sector_id,
        pipeId: 0,
      };
      
      const pipes = await this.backendApiUsecase.getPipeNosql(call, filter);
      
      callback(null, { pipes });
    } catch (error) {
      this.log.error(`GetPipes error: ${error}`);
      callback({ code: grpc.status.INTERNAL, message: String(error) });
    }
  };
  
  getPipe = async (call: any, callback: any) => {
    try {
      const req = call.request;
      const filter = {
        databaseName: this.dbName,
        collectionName: 'm_pipe',
        locationId: req.location_id,
        sectorId: req.sector_id,
        pipeId: req.pipe_id,
      };
      
      const pipes = await this.backendApiUsecase.getPipeNosql(call, filter);
      
      callback(null, { pipe: pipes.length > 0 ? pipes[0] : null });
    } catch (error) {
      this.log.error(`GetPipe error: ${error}`);
      callback({ code: grpc.status.INTERNAL, message: String(error) });
    }
  };
  
  savePipe = async (call: any, callback: any) => {
    try {
      const req = call.request;
      const filter = {
        databaseName: this.dbName,
        collectionName: 'm_pipe',
        locationId: req.location_id,
        sectorId: req.sector_id,
        pipeId: 0,
      };
      
      const pipes = await this.backendApiUsecase.savePipe(call, filter, req.pipe);
      
      callback(null, { pipes });
    } catch (error) {
      this.log.error(`SavePipe error: ${error}`);
      callback({ code: grpc.status.INTERNAL, message: String(error) });
    }
  };
  
  updatePipe = async (call: any, callback: any) => {
    try {
      const req = call.request;
      const filter = {
        databaseName: this.dbName,
        collectionName: 'm_pipe',
        locationId: req.location_id,
        sectorId: req.sector_id,
        pipeId: 0,
      };
      
      const pipes = await this.backendApiUsecase.updatePipe(call, filter, req.pipe);
      
      callback(null, { pipes });
    } catch (error) {
      this.log.error(`UpdatePipe error: ${error}`);
      callback({ code: grpc.status.INTERNAL, message: String(error) });
    }
  };
  
  deletePipe = async (call: any, callback: any) => {
    try {
      const req = call.request;
      const filter = {
        databaseName: this.dbName,
        collectionName: 'm_pipe',
        locationId: req.location_id,
        sectorId: req.sector_id,
        pipeId: 0,
      };
      
      const pipes = await this.backendApiUsecase.deletePipe(call, filter, req.pipe);
      
      callback(null, { pipes });
    } catch (error) {
      this.log.error(`DeletePipe error: ${error}`);
      callback({ code: grpc.status.INTERNAL, message: String(error) });
    }
  };
  
  // Area methods
  getAreas = async (call: any, callback: any) => {
    try {
      const req = call.request;
      const filter = {
        databaseName: this.dbName,
        collectionName: 'm_area',
        location: req.location_id,
        sector: req.sector_id,
        id: 0,
      };
      
      const areas = await this.backendApiUsecase.getAreaNosql(call, filter);
      
      callback(null, { areas });
    } catch (error) {
      this.log.error(`GetAreas error: ${error}`);
      callback({ code: grpc.status.INTERNAL, message: String(error) });
    }
  };
  
  // Map methods
  getMap = async (call: any, callback: any) => {
    try {
      const req = call.request;
      const filter = {
        databaseName: this.dbName,
        collectionName: 'm_map',
        mapId: 0,
        sectorId: req.sector_id,
        locationId: req.location_id,
      };
      
      const map = await this.backendApiUsecase.getMap(call, filter);
      
      callback(null, { map });
    } catch (error) {
      this.log.error(`GetMap error: ${error}`);
      callback({ code: grpc.status.INTERNAL, message: String(error) });
    }
  };
  
  saveMap = async (call: any, callback: any) => {
    try {
      const req = call.request;
      const filter = {
        databaseName: this.dbName,
        collectionName: 'm_map',
        mapId: req.map.map_id,
        sectorId: req.map.sector_id,
        locationId: req.map.location_id,
      };
      
      const map = await this.backendApiUsecase.saveMapNosql(call, filter, req.map);
      
      callback(null, { map });
    } catch (error) {
      this.log.error(`SaveMap error: ${error}`);
      callback({ code: grpc.status.INTERNAL, message: String(error) });
    }
  };
  
  updateMap = async (call: any, callback: any) => {
    try {
      const req = call.request;
      const filter = {
        databaseName: this.dbName,
        collectionName: 'm_map',
        mapId: req.map.map_id,
        sectorId: req.map.sector_id,
        locationId: req.map.location_id,
      };
      
      const map = await this.backendApiUsecase.updateMapNosql(call, filter, req.map);
      
      callback(null, { map });
    } catch (error) {
      this.log.error(`UpdateMap error: ${error}`);
      callback({ code: grpc.status.INTERNAL, message: String(error) });
    }
  };
  
  deleteMap = async (call: any, callback: any) => {
    try {
      const req = call.request;
      const filter = {
        databaseName: this.dbName,
        collectionName: 'm_map',
        mapId: req.map.map_id,
        sectorId: req.map.sector_id,
        locationId: req.map.location_id,
      };
      
      const result = await this.backendApiUsecase.deleteMapNosql(call, filter, req.map);
      
      callback(null, { result });
    } catch (error) {
      this.log.error(`DeleteMap error: ${error}`);
      callback({ code: grpc.status.INTERNAL, message: String(error) });
    }
  };
  
  // MJob methods
  getMJob = async (call: any, callback: any) => {
    try {
      const req = call.request;
      const filter = {
        databaseName: this.dbName,
        collectionName: 'm_job',
        locationId: req.location_id,
        sectorId: req.sector_id,
        jobId: req.job_id || 0,
      };
      
      const jobs = await this.backendApiUsecase.getMJobNosql(call, filter);
      
      callback(null, { jobs });
    } catch (error) {
      this.log.error(`GetMJob error: ${error}`);
      callback({ code: grpc.status.INTERNAL, message: String(error) });
    }
  };
  
  saveMJob = async (call: any, callback: any) => {
    try {
      const req = call.request;
      const filter = {
        databaseName: this.dbName,
        collectionName: 'm_job',
        locationId: req.location_id,
        sectorId: req.sector_id,
        jobId: 0,
      };
      
      const job = await this.backendApiUsecase.saveMJobNosql(call, filter, req.job);
      
      callback(null, { job });
    } catch (error) {
      this.log.error(`SaveMJob error: ${error}`);
      callback({ code: grpc.status.INTERNAL, message: String(error) });
    }
  };
  
  updateMJob = async (call: any, callback: any) => {
    try {
      const req = call.request;
      const filter = {
        databaseName: this.dbName,
        collectionName: 'm_job',
        locationId: req.location_id,
        sectorId: req.sector_id,
        jobId: 0,
      };
      
      const job = await this.backendApiUsecase.updateMJobNosql(call, filter, req.job);
      
      callback(null, { job });
    } catch (error) {
      this.log.error(`UpdateMJob error: ${error}`);
      callback({ code: grpc.status.INTERNAL, message: String(error) });
    }
  };
  
  deleteMJob = async (call: any, callback: any) => {
    try {
      const req = call.request;
      const filter = {
        databaseName: this.dbName,
        collectionName: 'm_job',
        locationId: req.location_id,
        sectorId: req.sector_id,
        jobId: 0,
      };
      
      const result = await this.backendApiUsecase.deleteMJobNosql(call, filter, req.job);
      
      callback(null, { result });
    } catch (error) {
      this.log.error(`DeleteMJob error: ${error}`);
      callback({ code: grpc.status.INTERNAL, message: String(error) });
    }
  };
  
  // Task methods
  getTasks = async (call: any, callback: any) => {
    try {
      const filter = {
        databaseName: this.dbName,
        collectionName: 'm_task',
        name: '',
        type: '',
        id: 0,
      };
      
      const tasks = await this.backendApiUsecase.getTasks(call, filter);
      
      callback(null, { tasks });
    } catch (error) {
      this.log.error(`GetTasks error: ${error}`);
      callback({ code: grpc.status.INTERNAL, message: String(error) });
    }
  };
  
  getTask = async (call: any, callback: any) => {
    try {
      const req = call.request;
      const filter = {
        databaseName: this.dbName,
        collectionName: 'm_task',
        name: req.task_name || '',
        type: req.task_type || '',
        id: req.task_id || 0,
      };
      
      const task = await this.backendApiUsecase.getTask(call, filter);
      
      callback(null, { task });
    } catch (error) {
      this.log.error(`GetTask error: ${error}`);
      callback({ code: grpc.status.INTERNAL, message: String(error) });
    }
  };
  
  // Goal methods
  getGoals = async (call: any, callback: any) => {
    try {
      const req = call.request;
      const filter = {
        databaseName: this.dbName,
        collectionName: 'm_goal',
        locationId: req.location_id,
        sectorId: req.sector_id,
        goalId: 0,
      };
      
      const goals = await this.backendApiUsecase.getGoalNosql(call, filter);
      
      callback(null, { goals });
    } catch (error) {
      this.log.error(`GetGoals error: ${error}`);
      callback({ code: grpc.status.INTERNAL, message: String(error) });
    }
  };
  
  // Tag methods
  getTags = async (call: any, callback: any) => {
    try {
      const req = call.request;
      const filter = {
        databaseName: this.dbName,
        collectionName: 'm_tag',
        locationId: req.location_id,
        sectorId: req.sector_id,
        tagId: 0,
      };
      
      const tags = await this.backendApiUsecase.getTagNosql(call, filter);
      
      callback(null, { tags });
    } catch (error) {
      this.log.error(`GetTags error: ${error}`);
      callback({ code: grpc.status.INTERNAL, message: String(error) });
    }
  };
  
  // Station methods
  getStations = async (call: any, callback: any) => {
    try {
      const req = call.request;
      const filter = {
        databaseName: this.dbName,
        collectionName: 'm_station',
        locationId: req.location_id,
        sectorId: req.sector_id,
        id: 0,
        filterType: req.filter_type || 0,
        sortType: req.sort_type || 0,
        orderType: req.order_type || 0,
        offset: req.fetch_offset || 0,
        limit: req.fetch_limit || 0,
      };
      
      const stations = await this.backendApiUsecase.getStations(call, filter);
      
      callback(null, { stations });
    } catch (error) {
      this.log.error(`GetStations error: ${error}`);
      callback({ code: grpc.status.INTERNAL, message: String(error) });
    }
  };
  
  getStation = async (call: any, callback: any) => {
    try {
      const req = call.request;
      const filter = {
        databaseName: this.dbName,
        collectionName: 'm_station',
        locationId: req.location_id,
        sectorId: req.sector_id,
        id: req.id,
        filterType: 0,
        sortType: 0,
        orderType: 0,
        offset: 0,
        limit: 0,
      };
      
      const station = await this.backendApiUsecase.getStation(call, filter);
      
      callback(null, { station });
    } catch (error) {
      this.log.error(`GetStation error: ${error}`);
      callback({ code: grpc.status.INTERNAL, message: String(error) });
    }
  };
  
  addStation = async (call: any, callback: any) => {
    try {
      const req = call.request;
      const filter = {
        databaseName: this.dbName,
        collectionName: 'm_station',
        locationId: req.station.location_id,
        sectorId: req.station.sector_id,
        id: 0,
        filterType: 0,
        sortType: 0,
        orderType: 0,
        offset: 0,
        limit: 0,
      };
      
      const stationId = await this.backendApiUsecase.addStation(call, filter, req.station);
      
      callback(null, {
        result: stationId > 0 ? 0 : 1,
        id: stationId,
      });
    } catch (error) {
      this.log.error(`AddStation error: ${error}`);
      callback(null, { result: 1, id: 0 });
    }
  };
  
  updateStation = async (call: any, callback: any) => {
    try {
      const req = call.request;
      const filter = {
        databaseName: this.dbName,
        collectionName: 'm_station',
        locationId: req.station.location_id,
        sectorId: req.station.sector_id,
        id: 0,
        filterType: 0,
        sortType: 0,
        orderType: 0,
        offset: 0,
        limit: 0,
      };
      
      await this.backendApiUsecase.updateStation(call, filter, req.station);
      
      callback(null, { result: 0 });
    } catch (error) {
      this.log.error(`UpdateStation error: ${error}`);
      callback(null, { result: 1 });
    }
  };
  
  deleteStation = async (call: any, callback: any) => {
    try {
      const req = call.request;
      const filter = {
        databaseName: this.dbName,
        collectionName: 'm_station',
        locationId: req.location_id,
        sectorId: req.sector_id,
        id: 0,
        filterType: 0,
        sortType: 0,
        orderType: 0,
        offset: 0,
        limit: 0,
      };
      
      await this.backendApiUsecase.deleteStation(call, filter, req.id);
      
      callback(null, { result: 0 });
    } catch (error) {
      this.log.error(`DeleteStation error: ${error}`);
      callback(null, { result: 1 });
    }
  };
}

