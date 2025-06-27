import { Router } from 'express';
import { DataSource } from 'typeorm';

// Controllers.
import controller from '../controllers/health';

const healthRoutes = (dataSource: DataSource) => {
  const router = Router();

  const healthController = controller(dataSource);

  /**
   * @swagger
   * /health:
   *  get:
   *    summary: Health information
   *    description: API and database health information
   *    tags:
   *      - Health
   *    responses:
   *      200:
   *        description: API and database health information
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/HealthResponse'
   */
  router.get('/', healthController.getHealthInfo);

  return router;
};

export default healthRoutes;

/**
 * @swagger
 * components:
 *  schemas:
 *    HealthResponse:
 *      type: object
 *      properties:
 *        status:
 *          type: string
 *          description: API status
 *          example: healthy
 *        dependencies:
 *          type: object
 *          properties:
 *            database:
 *              type: string
 *              description: Database status
 *              example: connected
 */
