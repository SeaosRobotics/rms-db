export interface User {
  user_id: number;
  user_name: string;
  user_password: string;
  display_name: string;
  auth_type: number;
  create_user: string;
  create_date: number;
  update_user: string;
  update_date: number;
  update_count: number;
}

export interface UserFilter {
  databaseName: string;
  collectionName: string;
  userId: number;
  userName: string;
  fetchOffset: number;
  fetchLimit: number;
  filterType: number;
  sortType: number;
  orderType: number;
}

export interface UserUsecase {
  fetch(ctx: any, filter: UserFilter): Promise<User[]>;
  add(ctx: any, filter: UserFilter, arg: User): Promise<number>;
  update(ctx: any, filter: UserFilter, arg: User): Promise<void>;
  delete(ctx: any, filter: UserFilter, userId: number): Promise<void>;
}

export interface UserRepository {
  fetch(ctx: any, filter: UserFilter): Promise<User[]>;
  add(ctx: any, filter: UserFilter, arg: User): Promise<number>;
  update(ctx: any, filter: UserFilter, arg: User): Promise<void>;
  delete(ctx: any, filter: UserFilter, userId: number): Promise<void>;
}

