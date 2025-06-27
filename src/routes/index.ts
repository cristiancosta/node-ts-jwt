import { Router } from 'express';
import { DataSource } from 'typeorm';

// Routes.
import healthRoutes from './health';

const routes = (dataSource: DataSource) => {
  const router = Router();

  router.use('/health', healthRoutes(dataSource));

  return router;
};

export default routes;
