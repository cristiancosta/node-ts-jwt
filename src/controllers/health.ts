import { DataSource } from 'typeorm';
import { Request, Response } from 'express';

// Types.
import { HealthController, HealthResponse } from '../types/health';

export const healthController = (dataSource: DataSource): HealthController => {
  const getHealthInfo = async (req: Request, res: Response): Promise<void> => {
    const result: HealthResponse = {
      status: 'healthy',
      dependencies: {
        database: 'connected'
      }
    };
    try {
      await dataSource.query('select version()');
    } catch (error) {
      result.dependencies = {
        database: 'not-connected',
        reason: JSON.stringify(error)
      };
    }
    res.send(result);
  };

  return {
    getHealthInfo
  };
};
