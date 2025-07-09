import { Router } from 'express';
import { DataSource } from 'typeorm';

// Controllers.
import { userController } from '../controllers/user';

// Middlewares.
import { authBearer } from '../middlewares/auth-bearer';

export const userRoutes = (dataSource: DataSource): Router => {
  const router = Router();

  const controller = userController(dataSource);

  router.get('/:id', authBearer, controller.getUser);

  return router;
};
