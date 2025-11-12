import { Notification, NotificationFilter, NotificationUsecase, NotificationRepository } from './notification_domain';
import logger from '../../tools/logger/logger';

export class NotificationUsecaseImpl implements NotificationUsecase {
  constructor(
    private notificationRepo: NotificationRepository,
    private contextTimeout: number,
    private log: typeof logger
  ) {}

  async fetch(ctx: any, filter: NotificationFilter): Promise<Notification[]> {
    const timeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), this.contextTimeout * 1000)
    );
    
    return Promise.race([
      this.notificationRepo.fetch(ctx, filter),
      timeout
    ]) as Promise<Notification[]>;
  }

  async add(ctx: any, filter: NotificationFilter, arg: Notification): Promise<number> {
    return this.notificationRepo.add(ctx, filter, arg);
  }

  async update(ctx: any, filter: NotificationFilter, arg: Notification): Promise<void> {
    return this.notificationRepo.update(ctx, filter, arg);
  }
}

