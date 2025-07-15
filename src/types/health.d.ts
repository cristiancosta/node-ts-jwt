import { Request, Response } from 'express';

export type GetHealthInfoResponse = {
  status: 'healthy';
  dependencies: {
    database: 'connected' | 'not-connected';
    reason?: string;
  };
};

export type HealthController = {
  getHealthInfo: (req: Request, res: Response) => Promise<void>;
};
