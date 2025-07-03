import { Request, Response } from 'express';

export type SignUpInputDto = {
  username: string;
  password: string;
};

export type SignUpOutputDto = {
  id: number;
  username: string;
  createdAt: Date;
  updatedAt: Date;
};

export type AuthService = {
  signUp: (signUpDto: SignUpInputDto) => Promise<SignUpOutputDto>;
};

export type AuthController = {
  signUp: (req: Request, res: Response) => Promise<void>;
};
