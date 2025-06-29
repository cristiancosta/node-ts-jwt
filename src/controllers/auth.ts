import { Request, Response } from 'express';
import { DataSource } from 'typeorm';

import service from '../services/auth';
import repository from '../repositories/user';

const authController = (dataSource: DataSource) => {
  const userRepository = repository(dataSource);
  const authService = service(userRepository);

  const signUp = async (req: Request, res: Response) => {
    const { username, password } = req.body as {
      username: string;
      password: string;
    };
    const result = await authService.signUp({ username, password });
    res.send(result);
  };

  return {
    signUp
  };
};

export default authController;
