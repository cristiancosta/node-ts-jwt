import { DataSource } from 'typeorm';
import { Request, Response } from 'express';

// Types.
import { HealthResponse } from '../types/health';

const healthController = (dataSource: DataSource) => {
  const getHealthInfo = async (req: Request, res: Response) => {
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

export default healthController;
