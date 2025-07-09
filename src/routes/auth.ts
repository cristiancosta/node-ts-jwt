import { Router } from 'express';
import { DataSource } from 'typeorm';

// Controllers.
import { authController } from '../controllers/auth';

export const authRoutes = (dataSource: DataSource): Router => {
  const router = Router();

  const controller = authController(dataSource);

  /**
   * @swagger
   * /auth/sign-in:
   *  post:
   *    summary: Sign in user
   *    description: Sign in user
   *    tags:
   *      - Authentication
   *    requestBody:
   *      content:
   *        application/json:
   *          schema:
   *            type: object
   *            properties:
   *              username:
   *                type: string
   *                description: User name
   *                example: myusername
   *              password:
   *                type: string
   *                description: User password
   *                example: pa55w0rd
   *            required:
   *              - username
   *              - password
   *    responses:
   *      200:
   *        description: Access and refresh tokens
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/SignInResponse'
   *      400:
   *        description: Bad request
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/InvalidCredentialsResponse'
   *      404:
   *        description: Not found
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/UserNotFoundResponse'
   *      500:
   *        description: Internal server error
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/InternalServerErrorResponse'
   */
  router.post('/sign-in', controller.signIn);

  /**
   * @swagger
   * /auth/sign-up:
   *  post:
   *    summary: Sign up user
   *    description: Sign up user
   *    tags:
   *      - Authentication
   *    requestBody:
   *      content:
   *        application/json:
   *          schema:
   *            type: object
   *            properties:
   *              username:
   *                type: string
   *                description: User name
   *                example: myusername
   *              password:
   *                type: string
   *                description: User password
   *                example: pa55w0rd
   *            required:
   *              - username
   *              - password
   *    responses:
   *      200:
   *        description: Created user
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/SignUpResponse'
   *      409:
   *        description: Conflict
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/UserAlreadyExistResponse'
   *      500:
   *        description: Internal server error
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/InternalServerErrorResponse'
   */
  router.post('/sign-up', controller.signUp);

  return router;
};

/**
 * @swagger
 * components:
 *  schemas:
 *    SignInResponse:
 *      type: object
 *      properties:
 *        accessToken:
 *          type: string
 *          description: Access token
 *        refreshToken:
 *          type: string
 *          description: Refresh token
 *    SignUpResponse:
 *      type: object
 *      properties:
 *        id:
 *          type: number
 *          description: User identifier
 *          example: 1
 *        username:
 *          type: string
 *          description: User name
 *          example: myusername
 *        createdAt:
 *          type: string
 *          description: User created at
 *          example: 2025-06-22T20:13:10.325Z
 *        updatedAt:
 *          type: string
 *          description: User updated at
 *          example: 2025-06-22T20:13:10.325Z
 *    InvalidCredentialsResponse:
 *      type: object
 *      properties:
 *        message:
 *          type: string
 *          description: Error message
 *          example: INVALID_CREDENTIALS
 *    UserAlreadyExistResponse:
 *      type: object
 *      properties:
 *        message:
 *          type: string
 *          description: Error message
 *          example: USER_ALREADY_EXIST
 *    UserNotFoundResponse:
 *      type: object
 *      properties:
 *        message:
 *          type: string
 *          description: Error message
 *          example: USER_NOT_FOUND
 */
