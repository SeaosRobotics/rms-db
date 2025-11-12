# RMS Database Service - Node.js

This is the Node.js/TypeScript migration of the RMS data service from Go.

## Project Structure

```
rms-db/
├── src/
│   ├── app/
│   │   └── backend_api/          # gRPC API layer
│   ├── components_nosql/          # Domain components
│   │   ├── location/
│   │   ├── sector/
│   │   └── ...                    # Other components
│   ├── config/                    # Configuration
│   ├── tools/
│   │   ├── mongodb/               # MongoDB utilities
│   │   └── logger/                # Logging
│   └── index.ts                   # Main entry point
├── proto/                         # Protocol buffer definitions
├── config.json                    # Main configuration
├── mongodb.json                    # MongoDB configuration
└── package.json
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Build the project:
```bash
npm run build
```

3. Run the server:
```bash
npm start
```

Or for development:
```bash
npm run dev
```

## Architecture

The project follows a clean architecture pattern similar to the original Go codebase:

- **Domain Layer** (`*_domain.ts`): Interfaces and types for entities
- **Repository Layer** (`*_repository.ts`): Data access implementations
- **Usecase Layer** (`*_usecase.ts`): Business logic
- **Delivery Layer** (`backend_api_delivery.ts`): gRPC handlers

## Migration Status

### Completed Components
- ✅ Location
- ✅ Sector
- ✅ MongoDB connection utilities
- ✅ Logger setup
- ✅ Configuration management
- ✅ Main entry point and gRPC server setup

### Remaining Components
The following components need to be migrated following the same pattern:
- Job
- Robot
- Goal
- Tag
- Pipe
- Area
- Map
- Task
- Station
- User
- UserWorkspace
- Notification
- Localization
- RobotStatus
- CustomLog
- MJob

Each component should have:
1. `{component}_domain.ts` - Interfaces and types
2. `{component}_repository.ts` - MongoDB repository implementation
3. `{component}_usecase.ts` - Business logic implementation

Then integrate them into:
- `backend_api_usecase.ts` - Add usecase instances
- `backend_api_delivery.ts` - Implement gRPC handlers

## Configuration

Edit `config.json` to configure:
- Server address
- Context timeout
- Database type (MongoDB or DocumentDB)
- Database connection details

## Notes

- The proto file is copied from the original Go service
- TypeScript types are manually defined (could be generated from proto in the future)
- Some gRPC handlers are placeholders and need implementation
- DocumentDB support is not yet implemented

