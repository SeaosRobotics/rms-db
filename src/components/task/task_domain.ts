export interface Task {
  id: number;
  name: string;
  type: string;
}

export interface TaskFilter {
  databaseName: string;
  collectionName: string;
  name: string;
  type: string;
  id: number;
}

export interface TaskUsecase {
  fetch(ctx: any, filter: TaskFilter): Promise<Task[]>;
  fetchOne(ctx: any, filter: TaskFilter): Promise<Task | null>;
}

export interface TaskRepository {
  fetch(ctx: any, filter: TaskFilter): Promise<Task[]>;
  fetchOne(ctx: any, filter: TaskFilter): Promise<Task | null>;
}

