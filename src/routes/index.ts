import { Router } from 'express';
import { DataSource } from 'typeorm';

// Routes.
import { authRoutes } from './auth';
import { healthRoutes } from './health';
import { userRoutes } from './user';

export const routes = (dataSource: DataSource): Router => {
  const router = Router();

  router.use('/auth', authRoutes(dataSource));
  router.use('/health', healthRoutes(dataSource));
  router.use('/user', userRoutes(dataSource));

  return router;
};

/**
 * @swagger
 * components:
 *  securitySchemes:
 *    BearerAuth:
 *      type: http
 *      scheme: bearer
 *      bearerFormat: JWT
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UserNotFoundResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Error message
 *           example: USER_NOT_FOUND
 *     InternalServerErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Error message
 *           example: INTERNAL_SERVER_ERROR
 *     InvalidTokenResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Error message
 *           example: INVALID_TOKEN
 *     InvalidTokenSubjectResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Error message
 *           example: INVALID_TOKEN_SUBJECT
 *     InvalidAuthorizationPrefixResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Error message
 *           example: INVALID_AUTHORIZATION_PREFIX
 *     TokenExpiredResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Error message
 *           example: TOKEN_EXPIRED
 *     MissingAuthorizationHeaderResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Error message
 *           example: MISSING_AUTHORIZATION_HEADER
 *     MissingAuthorizationHeaderValueResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Error message
 *           example: MISSING_AUTHORIZATION_HEADER_VALUE
 */
