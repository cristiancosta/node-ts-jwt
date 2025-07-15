import { DataSource } from 'typeorm';
import { Request, Response } from 'express';

// Services.
import { authService } from '../services/auth';

// Repositories.
import { userRepository } from '../repositories/user';

// Types.
import { AuthController } from '../types/auth';

export const authController = (dataSource: DataSource): AuthController => {
  const service = authService(userRepository(dataSource));

  const signIn = async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body as {
      username: string;
      password: string;
    };
    const result = await service.signIn({ username, password });
    res.send(result);
  };

  const signUp = async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body as {
      username: string;
      password: string;
    };
    const result = await service.signUp({ username, password });
    res.send(result);
  };

  const refresh = async (req: Request, res: Response): Promise<void> => {
    const { refreshToken } = req.body as { refreshToken: string };
    const result = await service.refresh({ refreshToken });
    res.send(result);
  };

  return {
    signIn,
    signUp,
    refresh
  };
};
