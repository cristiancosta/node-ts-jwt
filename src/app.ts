import 'express-async-errors';
import express from 'express';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import { DataSource } from 'typeorm';

// Routes.
import routes from './routes';

// Swagger.
import swaggerSpecification from './swagger';

const createExpressApp = (dataSource: DataSource) => {
  const app = express();

  app.use(bodyParser.json());
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecification));
  app.use('/', routes(dataSource));

  return app;
};

export default createExpressApp;
