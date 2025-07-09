import { DataSource } from 'typeorm';
import { Request, Response } from 'express';

// Repositories.
import { userRepository } from '../repositories/user';

// Types.
import { UserController } from '../types/user';

// Services.
import { userService } from '../services/user';

export const userController = (dataSource: DataSource): UserController => {
  const service = userService(userRepository(dataSource));

  const getUser = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params as { id: string };
    const result = await service.getUser(parseInt(id, 10));
    res.send(result);
  };

  return {
    getUser
  };
};
