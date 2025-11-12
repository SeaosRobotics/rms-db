import { User, UserFilter, UserUsecase, UserRepository } from './user_domain';
import logger from '../../tools/logger/logger';
import * as bcrypt from 'bcrypt';

export class UserUsecaseImpl implements UserUsecase {
  constructor(
    private userRepo: UserRepository,
    private contextTimeout: number,
    private log: typeof logger
  ) {}

  async fetch(ctx: any, filter: UserFilter): Promise<User[]> {
    const timeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), this.contextTimeout * 1000)
    );
    
    return Promise.race([
      this.userRepo.fetch(ctx, filter),
      timeout
    ]) as Promise<User[]>;
  }

  async add(ctx: any, filter: UserFilter, arg: User): Promise<number> {
    // Hash password if not already hashed
    if (arg.user_password && !arg.user_password.startsWith('$2a$')) {
      arg.user_password = await bcrypt.hash(arg.user_password, 10);
    }
    
    const now = Date.now() / 1000;
    arg.create_date = now;
    arg.update_date = now;
    
    return this.userRepo.add(ctx, filter, arg);
  }

  async update(ctx: any, filter: UserFilter, arg: User): Promise<void> {
    // Hash password if updating and not already hashed
    if (arg.user_password && !arg.user_password.startsWith('$2a$')) {
      arg.user_password = await bcrypt.hash(arg.user_password, 10);
    }
    
    arg.update_date = Date.now() / 1000;
    arg.update_count++;
    
    return this.userRepo.update(ctx, filter, arg);
  }

  async delete(ctx: any, filter: UserFilter, userId: number): Promise<void> {
    return this.userRepo.delete(ctx, filter, userId);
  }
}

