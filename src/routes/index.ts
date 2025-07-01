import { Router } from 'express';
import { DataSource } from 'typeorm';

// Routes.
import { authRoutes } from './auth';
import { healthRoutes } from './health';

export const routes = (dataSource: DataSource) => {
  const router = Router();

  router.use('/auth', authRoutes(dataSource));
  router.use('/health', healthRoutes(dataSource));

  return router;
};
