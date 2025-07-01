import { MySqlContainer } from '@testcontainers/mysql';

// App.
import { createExpressApp } from '../../src/app';

// DataSource.
import { createDataSource } from '../../src/data-source';

// Types.
import { TestContext } from './types/setup';
import { DataSourceConfiguration } from '../../src/types/configuration';

const buildResources = async () => {
  const container = await new MySqlContainer('mysql').start();

  const dbConfig: DataSourceConfiguration = {
    database: container.getDatabase(),
    username: container.getUsername(),
    password: container.getUserPassword(),
    host: container.getHost(),
    port: container.getPort()
  };
  const dataSource = await createDataSource(dbConfig).initialize();
  const app = createExpressApp(dataSource);
  const context: TestContext = { container, dataSource, app };
  return context;
};

const teardownResources = async (context: TestContext) => {
  if (context.dataSource.isInitialized) {
    await context.dataSource.destroy();
  }
  await context.container.stop();
};

export { buildResources, teardownResources };
