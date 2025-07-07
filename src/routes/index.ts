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

/**
 * @swagger
 * components:
 *   schemas:
 *     InternalServerErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Error message
 *           example: INTERNAL_SERVER_ERROR
 */
