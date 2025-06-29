import { Router } from 'express';
import { DataSource } from 'typeorm';

// Controllers.
import controller from '../controllers/auth';

const authRoutes = (dataSource: DataSource) => {
  const router = Router();
  const authController = controller(dataSource);
  router.post('/sign-up', authController.signUp);
  return router;
};

export default authRoutes;
