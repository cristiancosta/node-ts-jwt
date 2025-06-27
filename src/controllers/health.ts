import { Request, Response } from 'express';

const getHealthInfo = (req: Request, res: Response) => {
  res.send({ message: 'Hello node-ts-jwt not js' });
};

export default {
  getHealthInfo
};
