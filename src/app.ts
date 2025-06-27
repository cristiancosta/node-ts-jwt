import express from 'express';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';

// Routes.
import routes from './routes';

// Swagger.
import swaggerSpecification from './swagger';

const createExpressApp = () => {
  const app = express();

  app.use(bodyParser.json());
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecification));
  app.use('/', routes);

  return app;
};

export default createExpressApp;
