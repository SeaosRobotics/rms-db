import { MongoClient, Db, Collection } from 'mongodb';
import { loadMongoConfig } from '../../config/config';

interface RetryOptions {
  maxRetries: number;
  retryDelay: number;
}

let client: MongoClient | null = null;

export async function newClient(): Promise<{ client: MongoClient; dbName: string }> {
  const config = loadMongoConfig();
  const mongoConfig = config.mongodb;

  console.log('[DEBUG] Starting MongoDB connection process');

  const dbHost = mongoConfig.host;
  const dbName = mongoConfig.name;
  const timeout = mongoConfig.timeout || 120;

  console.log(`[DEBUG] MongoDB configuration: host=${dbHost}, dbName=${dbName}`);

  const retryOpts: RetryOptions = {
    maxRetries: 5,
    retryDelay: 5000,
  };

  let lastErr: Error | null = null;
  for (let attempt = 1; attempt <= retryOpts.maxRetries; attempt++) {
    console.log(`[DEBUG] MongoDB connection attempt ${attempt}/${retryOpts.maxRetries}`);

    try {
      client = await connectToMongoDB(dbHost, timeout);
      console.log(`[INFO] Successfully connected to MongoDB database: ${dbName}`);
      return { client, dbName };
    } catch (err) {
      lastErr = err as Error;
      console.log(`[ERROR] MongoDB connection attempt ${attempt} failed: ${err}`);

      if (attempt < retryOpts.maxRetries) {
        console.log(`[DEBUG] Retrying in ${retryOpts.retryDelay}ms...`);
        await new Promise(resolve => setTimeout(resolve, retryOpts.retryDelay));
      }
    }
  }

  console.log(`[ERROR] Failed to connect to MongoDB after ${retryOpts.maxRetries} attempts`);
  throw lastErr || new Error('Failed to connect to MongoDB');
}

async function connectToMongoDB(dbHost: string, timeout: number): Promise<MongoClient> {
  console.log(`[DEBUG] Creating MongoDB connection with timeout ${timeout} seconds`);

  const clientOptions = {
    connectTimeoutMS: timeout * 1000,
    serverSelectionTimeoutMS: timeout * 1000,
    socketTimeoutMS: timeout * 1000,
    maxPoolSize: 100,
    directConnection: true,
    retryWrites: false,
  };

  console.log(`[DEBUG] MongoDB connection options:`, clientOptions);

  const startTime = Date.now();
  const client = new MongoClient(dbHost, clientOptions);

  try {
    await client.connect();
    const connectDuration = Date.now() - startTime;
    console.log(`[DEBUG] MongoDB Connect() call completed in ${connectDuration}ms`);

    // Ping the MongoDB server
    console.log(`[DEBUG] Pinging MongoDB server to verify connection`);
    const pingStart = Date.now();
    await client.db().admin().ping();
    const pingDuration = Date.now() - pingStart;
    console.log(`[DEBUG] MongoDB ping completed successfully in ${pingDuration}ms`);

    return client;
  } catch (err) {
    await client.close();
    throw new Error(`Cannot connect to mongodb instance: ${err}`);
  }
}

export function getSeqNo(db: Db, seqName: string): number {
  console.log(`[DEBUG] Getting sequence number for ${seqName}`);
  const startTime = Date.now();

  const collection = db.collection(seqName);
  
  collection.updateOne(
    { SeqID: 1 },
    { $inc: { SeqNo: 1 } },
    { upsert: true }
  ).catch(err => {
    console.log(`[ERROR] Failed to update sequence ${seqName}: ${err}`);
  });

  const doc = collection.findOne({ SeqID: 1 });
  
  return doc.then(result => {
    if (!result) {
      console.log(`[ERROR] Documents not found for sequence ${seqName}`);
      return 0;
    }
    
    const numSeq = (result as any).SeqNo as number;
    
    // Add offset of 10000 for user IDs
    if (seqName === 'seq_user_id') {
      const finalSeq = numSeq + 10000;
      const duration = Date.now() - startTime;
      console.log(`[DEBUG] Retrieved sequence number for ${seqName} in ${duration}ms: ${finalSeq}`);
      return finalSeq;
    }
    
    const duration = Date.now() - startTime;
    console.log(`[DEBUG] Retrieved sequence number for ${seqName} in ${duration}ms: ${numSeq}`);
    return numSeq;
  }).catch(err => {
    console.log(`[ERROR] Error reading sequence ${seqName}: ${err}`);
    return 0;
  }) as any;
}

export async function getSeqNoAsync(db: Db, seqName: string): Promise<number> {
  console.log(`[DEBUG] Getting sequence number for ${seqName}`);
  const startTime = Date.now();

  const collection = db.collection(seqName);
  
  await collection.updateOne(
    { SeqID: 1 },
    { $inc: { SeqNo: 1 } },
    { upsert: true }
  ).catch(err => {
    console.log(`[ERROR] Failed to update sequence ${seqName}: ${err}`);
  });

  const result = await collection.findOne({ SeqID: 1 });
  
  if (!result) {
    console.log(`[ERROR] Documents not found for sequence ${seqName}`);
    return 0;
  }
  
  const numSeq = (result as any).SeqNo as number;
  
  // Add offset of 10000 for user IDs
  if (seqName === 'seq_user_id') {
    const finalSeq = numSeq + 10000;
    const duration = Date.now() - startTime;
    console.log(`[DEBUG] Retrieved sequence number for ${seqName} in ${duration}ms: ${finalSeq}`);
    return finalSeq;
  }
  
  const duration = Date.now() - startTime;
  console.log(`[DEBUG] Retrieved sequence number for ${seqName} in ${duration}ms: ${numSeq}`);
  return numSeq;
}

export async function getSectorSeqNo(db: Db, locationId: number): Promise<number> {
  const collection = db.collection('seq_sector_id');
  
  const filter = { locationId };
  const update = { $inc: { seq: 1 } };
  const options = { upsert: true, returnDocument: 'after' as const };

  const result = await collection.findOneAndUpdate(filter, update, options);
  
  if (!result || !result.value) {
    throw new Error('Failed to get next sector sequence number');
  }

  return (result.value as any).seq;
}

export async function getMJobSeqNo(db: Db, locationId: number, sectorId: number): Promise<number> {
  const collection = db.collection('seq_mjob_id');
  
  const filter = { location_id: locationId, sector_id: sectorId };
  const update = { $inc: { seq: 1 } };
  const options = { upsert: true, returnDocument: 'after' as const };

  const result = await collection.findOneAndUpdate(filter, update, options);
  
  if (!result || !result.value) {
    throw new Error('Failed to get next job sequence number');
  }

  return (result.value as any).seq;
}

export async function getMapSeqNo(db: Db, locationId: number, sectorId: number): Promise<number> {
  const collection = db.collection('seq_map_id');
  
  const filter = { location_id: locationId, sector_id: sectorId };
  const update = { $inc: { seq: 1 } };
  const options = { upsert: true, returnDocument: 'after' as const };

  const result = await collection.findOneAndUpdate(filter, update, options);
  
  if (!result || !result.value) {
    throw new Error('Failed to get next map sequence number');
  }

  return (result.value as any).seq;
}

