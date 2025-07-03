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

  const signUp = async (req: Request, res: Response) => {
    const { username, password } = req.body as {
      username: string;
      password: string;
    };
    const result = await service.signUp({ username, password });
    res.send(result);
  };

  return {
    signUp
  };
};
