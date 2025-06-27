import { Express } from 'express';
import { DataSource } from 'typeorm';
import { StartedMySqlContainer } from '@testcontainers/mysql';

export type TestContext = {
  container: StartedMySqlContainer;
  app: Express;
  dataSource: DataSource;
};
