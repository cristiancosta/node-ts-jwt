import 'reflect-metadata';
import { DataSource } from 'typeorm';

// Types.
import { DataSourceConfiguration } from './types/configuration';

const createDataSource = (dbConfig: DataSourceConfiguration) => {
  const { database, username, password, host, port } = dbConfig;
  const dataSource = new DataSource({
    type: 'mysql',
    host,
    port,
    username,
    password,
    database,
    entities: [],
    synchronize: true,
    logging: false
  });
  return dataSource;
};

export default createDataSource;
