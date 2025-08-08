import 'express-async-errors';
import express, { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import { DataSource } from 'typeorm';

// Routes.
import { routes } from './routes';

// Middlewares.
import { errorHandler } from './middlewares/error-handler';
import { swaggerBasicAuth } from './middlewares/swagger-basic-auth';

// Swagger.
import { swaggerDoc } from './swagger';

export const createExpressApp = (dataSource: DataSource): Express => {
  const app = express();

  app.use(express.json());
  app.use(
    '/api-docs',
    swaggerBasicAuth,
    swaggerUi.serve,
    swaggerUi.setup(swaggerDoc)
  );
  app.use('/', routes(dataSource));
  app.use(errorHandler);

  return app;
};
