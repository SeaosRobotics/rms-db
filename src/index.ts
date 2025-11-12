import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { MongoClient } from 'mongodb';
import { newClient } from './tools/mongodb/mongolib';
import { loadConfig } from './config/config';
import logger from './tools/logger/logger';
import { BackendApiServiceImpl } from './app/backend_api/backend_api_delivery';

async function main() {
  const config = loadConfig();
  
  let noSqlConn: MongoClient | null = null;
  let dbName = '';
  
  try {
    if (config.dbtype.mongodb) {
      // MongoDB connection
      const { client, dbName: db } = await newClient();
      noSqlConn = client;
      dbName = db;
      logger.info('Connected to MongoDB');
    } else if (config.dbtype.documentdb) {
      // DocumentDB connection - TODO: implement DocumentDB connection
      logger.error('DocumentDB connection not yet implemented');
      process.exit(1);
    }
    
    if (!noSqlConn) {
      logger.error('Failed to establish database connection');
      process.exit(1);
    }
    
    // Cleanup on exit
    process.on('SIGINT', async () => {
      logger.info('Shutting down...');
      if (noSqlConn) {
        await noSqlConn.close();
      }
      process.exit(0);
    });
    
    const timeoutContext = config.context.timeout;
    const listenPort = config.server.address || ':50151';
    
    // Load proto file
    const protoPath = require('path').join(__dirname, '../proto/backend_api.proto');
    const packageDefinition = protoLoader.loadSync(
      protoPath,
      {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
      }
    );
    
    const protoDescriptor = grpc.loadPackageDefinition(packageDefinition) as any;
    const backendApiProto = protoDescriptor.backend_api;
    
    // Create gRPC server
    const server = new grpc.Server();
    
    // Create backend API service
    const backendApiService = new BackendApiServiceImpl(
      noSqlConn,
      dbName,
      timeoutContext,
      logger
    );
    
    // Register the service
    server.addService(backendApiProto.BackendApiService.service, {
      GetLocation: backendApiService.getLocation.bind(backendApiService),
      GetJob: backendApiService.getJob.bind(backendApiService),
      AddJob: backendApiService.addJob.bind(backendApiService),
      UpdateJob: backendApiService.updateJob.bind(backendApiService),
      DeleteJob: backendApiService.deleteJob.bind(backendApiService),
      GetNotification: backendApiService.getNotification.bind(backendApiService),
      AddNotification: backendApiService.addNotification.bind(backendApiService),
      UpdateNotification: backendApiService.updateNotification.bind(backendApiService),
      GetLocalization: backendApiService.getLocalization.bind(backendApiService),
      AddLocalization: backendApiService.addLocalization.bind(backendApiService),
      GetRobotStatus: backendApiService.getRobotStatus.bind(backendApiService),
      AddRobotStatus: backendApiService.addRobotStatus.bind(backendApiService),
      GetCustomLog: backendApiService.getCustomLog.bind(backendApiService),
      AddCustomLog: backendApiService.addCustomLog.bind(backendApiService),
      GetUser: backendApiService.getUser.bind(backendApiService),
      AddUser: backendApiService.addUser.bind(backendApiService),
      UpdateUser: backendApiService.updateUser.bind(backendApiService),
      DeleteUser: backendApiService.deleteUser.bind(backendApiService),
      GetUsers: backendApiService.getUsers.bind(backendApiService),
      GetUserWorkspace: backendApiService.getUserWorkspace.bind(backendApiService),
      SaveWorkspaceLocation: backendApiService.saveWorkspaceLocation.bind(backendApiService),
      UpdateWorkspaceLocation: backendApiService.updateWorkspaceLocation.bind(backendApiService),
      DeleteWorkspaceLocation: backendApiService.deleteWorkspaceLocation.bind(backendApiService),
      SaveWorkspaceSector: backendApiService.saveWorkspaceSector.bind(backendApiService),
      UpdateWorkspaceSector: backendApiService.updateWorkspaceSector.bind(backendApiService),
      DeleteWorkspaceSector: backendApiService.deleteWorkspaceSector.bind(backendApiService),
      GetPipes: backendApiService.getPipes.bind(backendApiService),
      GetPipe: backendApiService.getPipe.bind(backendApiService),
      SavePipe: backendApiService.savePipe.bind(backendApiService),
      UpdatePipe: backendApiService.updatePipe.bind(backendApiService),
      DeletePipe: backendApiService.deletePipe.bind(backendApiService),
      GetAreas: backendApiService.getAreas.bind(backendApiService),
      AddLocation: backendApiService.addLocation.bind(backendApiService),
      UpdateLocation: backendApiService.updateLocation.bind(backendApiService),
      DeleteLocation: backendApiService.deleteLocation.bind(backendApiService),
      FetchSector: backendApiService.fetchSector.bind(backendApiService),
      AddSector: backendApiService.addSector.bind(backendApiService),
      UpdateSector: backendApiService.updateSector.bind(backendApiService),
      DeleteSector: backendApiService.deleteSector.bind(backendApiService),
      GetMap: backendApiService.getMap.bind(backendApiService),
      SaveMap: backendApiService.saveMap.bind(backendApiService),
      UpdateMap: backendApiService.updateMap.bind(backendApiService),
      DeleteMap: backendApiService.deleteMap.bind(backendApiService),
      GetMJob: backendApiService.getMJob.bind(backendApiService),
      SaveMJob: backendApiService.saveMJob.bind(backendApiService),
      UpdateMJob: backendApiService.updateMJob.bind(backendApiService),
      DeleteMJob: backendApiService.deleteMJob.bind(backendApiService),
      GetTasks: backendApiService.getTasks.bind(backendApiService),
      GetTask: backendApiService.getTask.bind(backendApiService),
      GetGoals: backendApiService.getGoals.bind(backendApiService),
      GetTags: backendApiService.getTags.bind(backendApiService),
      GetStations: backendApiService.getStations.bind(backendApiService),
      GetStation: backendApiService.getStation.bind(backendApiService),
      AddStation: backendApiService.addStation.bind(backendApiService),
      UpdateStation: backendApiService.updateStation.bind(backendApiService),
      DeleteStation: backendApiService.deleteStation.bind(backendApiService),
      GetRobots: backendApiService.getRobots.bind(backendApiService),
      UpdateRobot: backendApiService.updateRobot.bind(backendApiService),
      AddRobot: backendApiService.addRobot.bind(backendApiService),
      DeleteRobot: backendApiService.deleteRobot.bind(backendApiService),
    });
    
    // Start server
    server.bindAsync(
      listenPort,
      grpc.ServerCredentials.createInsecure(),
      (error, port) => {
        if (error) {
          logger.error(`Failed to start server: ${error}`);
          process.exit(1);
        }
        logger.info(`gRPC server listening on ${listenPort}`);
        server.start();
      }
    );
    
  } catch (error) {
    logger.error(`Failed to start application: ${error}`);
    if (noSqlConn) {
      await noSqlConn.close();
    }
    process.exit(1);
  }
}

main().catch(error => {
  logger.error(`Unhandled error: ${error}`);
  process.exit(1);
});

