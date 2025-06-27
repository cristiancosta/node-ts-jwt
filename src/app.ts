import express from 'express';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import { DataSource } from 'typeorm';

// Routes.
import routes from './routes';

// Swagger.
import swaggerSpecification from './swagger';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createExpressApp = (dataSource: DataSource) => {
  const app = express();

  app.use(bodyParser.json());
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecification));
  app.use('/', routes);

  return app;
};

export default createExpressApp;
