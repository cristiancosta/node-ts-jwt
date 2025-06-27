import { Router } from 'express';

// Routes.
import healthRoute from './health';

const router = Router();

router.use('/health', healthRoute);

export default router;
