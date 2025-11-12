# Migration Guide

This document explains the migration from Go to Node.js/TypeScript and how to complete the remaining components.

## What's Been Migrated

### ✅ Core Infrastructure
- Project setup (package.json, tsconfig.json)
- Configuration management (config.json, mongodb.json, documentdb.json)
- MongoDB connection utilities (`src/tools/mongodb/mongolib.ts`)
- Logger setup (`src/tools/logger/logger.ts`)
- Main entry point with gRPC server (`src/index.ts`)

### ✅ Components
- **Location**: Complete (domain, repository, usecase)
- **Sector**: Complete (domain, repository, usecase)

### ✅ Backend API Layer
- Domain types (`src/app/backend_api/backend_api_domain.ts`)
- Usecase layer (`src/app/backend_api/backend_api_usecase.ts`)
- Delivery layer with gRPC handlers (`src/app/backend_api/backend_api_delivery.ts`)
  - Location endpoints: ✅ Implemented
  - Sector endpoints: ✅ Implemented
  - Other endpoints: ⚠️ Placeholders (need implementation)

## Remaining Components to Migrate

The following components need to be created following the same pattern as Location and Sector:

1. **Job** (`components_nosql/job/`)
2. **Robot** (`components_nosql/robot/`)
3. **Goal** (`components_nosql/goal/`)
4. **Tag** (`components_nosql/tag/`)
5. **Pipe** (`components_nosql/pipe/`)
6. **Area** (`components_nosql/area/`)
7. **Map** (`components_nosql/maps/`)
8. **Task** (`components_nosql/task/`)
9. **Station** (`components_nosql/station/`)
10. **User** (`components_nosql/user/`)
11. **UserWorkspace** (`components_nosql/userworkspace/`)
12. **Notification** (`components_nosql/notification/`)
13. **Localization** (`components_nosql/localization/`)
14. **RobotStatus** (`components_nosql/robotstatus/`)
15. **CustomLog** (`components_nosql/customlog/`)
16. **MJob** (`components_nosql/mjob/`)

## How to Migrate a Component

For each component, create three files following this pattern:

### 1. Domain File (`{component}_domain.ts`)

```typescript
export interface ComponentName {
  // Fields matching the Go struct
  field1: number;
  field2: string;
  // ...
}

export interface ComponentNameFilter {
  databaseName: string;
  collectionName: string;
  // Filter fields
}

export interface ComponentNameUsecase {
  fetch(ctx: any, filter: ComponentNameFilter): Promise<ComponentName[]>;
  // Other methods
}

export interface ComponentNameRepository {
  fetch(ctx: any, filter: ComponentNameFilter): Promise<ComponentName[]>;
  // Other methods
}
```

### 2. Repository File (`{component}_repository.ts`)

```typescript
import { MongoClient } from 'mongodb';
import { ComponentName, ComponentNameFilter, ComponentNameRepository } from './component_domain';
import logger from '../../tools/logger/logger';
import { getSeqNoAsync } from '../../tools/mongodb/mongolib'; // If needed

export class ComponentNameRepositoryImpl implements ComponentNameRepository {
  constructor(
    private conn: MongoClient,
    private log: typeof logger
  ) {}

  async fetch(ctx: any, filter: ComponentNameFilter): Promise<ComponentName[]> {
    const results: ComponentName[] = [];
    const collection = this.conn.db(filter.databaseName).collection(filter.collectionName);
    
    const findFilter: any = { /* build filter */ };
    const cursor = collection.find(findFilter);
    
    for await (const doc of cursor) {
      results.push({
        // Map doc fields to ComponentName
      });
    }
    
    return results;
  }

  // Implement other methods (add, update, delete, etc.)
}
```

### 3. Usecase File (`{component}_usecase.ts`)

```typescript
import { ComponentName, ComponentNameFilter, ComponentNameUsecase, ComponentNameRepository } from './component_domain';
import logger from '../../tools/logger/logger';

export class ComponentNameUsecaseImpl implements ComponentNameUsecase {
  constructor(
    private componentRepo: ComponentNameRepository,
    private contextTimeout: number,
    private log: typeof logger
  ) {}

  async fetch(ctx: any, filter: ComponentNameFilter): Promise<ComponentName[]> {
    const timeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), this.contextTimeout * 1000)
    );
    
    return Promise.race([
      this.componentRepo.fetch(ctx, filter),
      timeout
    ]) as Promise<ComponentName[]>;
  }

  // Implement other methods
}
```

### 4. Integration Steps

After creating the component files:

1. **Add to `backend_api_usecase.ts`**:
   - Import the usecase and repository
   - Create an instance in the constructor
   - Add methods to the interface and implementation

2. **Add to `backend_api_delivery.ts`**:
   - Implement the gRPC handler methods
   - Convert proto requests to domain types
   - Call the usecase methods
   - Convert domain types back to proto responses

3. **Register in `index.ts`**:
   - The handlers are already registered, just implement them in delivery

## Key Differences from Go

1. **Types**: TypeScript uses interfaces instead of structs
2. **Error Handling**: Use try/catch instead of explicit error returns
3. **Async/Await**: Use async/await instead of goroutines
4. **MongoDB Driver**: Uses the official MongoDB Node.js driver
5. **gRPC**: Uses `@grpc/grpc-js` instead of `google.golang.org/grpc`

## Testing

To test the migration:

1. Install dependencies: `npm install`
2. Build: `npm run build`
3. Run: `npm start` or `npm run dev`
4. Test with a gRPC client

## Notes

- The proto file is shared between Go and Node.js versions
- TypeScript types are manually defined (could be auto-generated)
- Some complex Go patterns (like copier) are replaced with manual mapping
- Sequence number generation uses async/await instead of synchronous calls

