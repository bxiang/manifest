import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { SqljsEntityManager } from 'typeorm/entity-manager/SqljsEntityManager';
import { SqljsConnectionOptions } from 'typeorm/driver/sqljs/SqljsConnectionOptions';

@Injectable()
export class DatabaseSaveService implements OnApplicationShutdown {
  constructor(private readonly dataSource: DataSource) {}

  async save(): Promise<void> {
    if (this.dataSource.options.type !== 'sqljs') return;
    const opts = this.dataSource.options as SqljsConnectionOptions;
    if (!opts.location) return;
    const manager = this.dataSource.manager as SqljsEntityManager;
    await manager.saveDatabase();
  }

  async onApplicationShutdown(): Promise<void> {
    await this.save();
  }
}
