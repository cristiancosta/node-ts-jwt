import { Router } from 'express';
import { DataSource } from 'typeorm';

// Controllers.
import { userController } from '../controllers/user';

// Middlewares.
import { authBearer } from '../middlewares/auth-bearer';

export const userRoutes = (dataSource: DataSource): Router => {
  const router = Router();

  /**
   * @swagger
   * /user/{id}:
   *  get:
   *    summary: Retrieve a single user
   *    description: Retrieve user information given by his identifier
   *    security:
   *      - BearerAuth: []
   *    tags:
   *      - User
   *    parameters:
   *      - name: id
   *        in: path
   *        required: true
   *        description: User identifier
   *        schema:
   *          type: number
   *          example: 1
   *    responses:
   *      200:
   *        description: A single user
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/GetUserOutputDto'
   *      401:
   *        description: Unauthorized
   *        content:
   *          application/json:
   *            schema:
   *              oneOf:
   *                - $ref: '#/components/schemas/InvalidTokenResponse'
   *                - $ref: '#/components/schemas/InvalidTokenSubjectResponse'
   *                - $ref: '#/components/schemas/TokenExpiredResponse'
   *                - $ref: '#/components/schemas/MissingAuthorizationHeaderResponse'
   *                - $ref: '#/components/schemas/MissingAuthorizationHeaderValueResponse'
   *      404:
   *        description: Not found
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/UserNotFoundResponse'
   *      409:
   *        description: Conflict
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/InvalidAuthorizationPrefixResponse'
   *      500:
   *        description: Internal server error
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/InternalServerErrorResponse'
   */
  const controller = userController(dataSource);

  router.get('/:id', authBearer, controller.getUser);

  return router;
};

/**
 * @swagger
 * components:
 *  schemas:
 *    GetUserOutputDto:
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
 */
