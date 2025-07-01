import { Request, Response } from 'express';
import { DataSource } from 'typeorm';

// Services.
import { authService } from '../services/auth';

// Repositories.
import { userRepository } from '../repositories/user';

export const authController = (dataSource: DataSource) => {
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
