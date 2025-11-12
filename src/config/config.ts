import * as fs from 'fs';
import * as path from 'path';

export interface Config {
  debug: boolean;
  server: {
    address: string;
  };
  context: {
    timeout: number;
  };
  dbtype: {
    mongodb: boolean;
    documentdb: boolean;
  };
  database: {
    host: string;
    port: string;
    user: string;
    pass: string;
    name: string;
  };
  mongodb: {
    host: string;
    port: string;
    name: string;
    username: string;
    password: string;
  };
}

export interface MongoConfig {
  mongodb: {
    host: string;
    port: string;
    user: string;
    pass: string;
    name: string;
    timeout: number;
  };
}

export interface DocumentDBConfig {
  documentdb: {
    endpoint: string;
    user: string;
    pass: string;
    database: string;
    connect_timeout: number;
    query_timeout: number;
    readPreference: string;
    ca_file_path: string;
  };
}

let config: Config | null = null;
let mongoConfig: MongoConfig | null = null;
let documentDBConfig: DocumentDBConfig | null = null;

export function loadConfig(): Config {
  if (config) return config;
  
  const configPath = path.join(__dirname, '../../config.json');
  const configData = fs.readFileSync(configPath, 'utf-8');
  config = JSON.parse(configData);
  return config!;
}

export function loadMongoConfig(): MongoConfig {
  if (mongoConfig) return mongoConfig;
  
  const configPath = path.join(__dirname, '../../mongodb.json');
  const configData = fs.readFileSync(configPath, 'utf-8');
  mongoConfig = JSON.parse(configData);
  return mongoConfig!;
}

export function loadDocumentDBConfig(): DocumentDBConfig {
  if (documentDBConfig) return documentDBConfig;
  
  const configPath = path.join(__dirname, '../../documentdb.json');
  const configData = fs.readFileSync(configPath, 'utf-8');
  documentDBConfig = JSON.parse(configData);
  return documentDBConfig!;
}

