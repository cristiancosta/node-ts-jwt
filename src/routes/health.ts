import { Router } from 'express';

// Controllers.
import healthController from '../controllers/health';

const router = Router();

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

export default router;

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
