import 'express-async-errors';
import express from 'express';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import { DataSource } from 'typeorm';

// Routes.
import routes from './routes';

// Middlewares.
import { errorHandler, swaggerBasicAuth } from './middlewares';

// Swagger.
import swaggerDoc from './swagger';

const createExpressApp = (dataSource: DataSource) => {
  const app = express();

  app.use(bodyParser.json());
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

export default createExpressApp;
