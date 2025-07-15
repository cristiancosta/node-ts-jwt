import { Request, Response } from 'express';

export type AuthService = {
  signIn: (signUpDto: SignInInputDto) => Promise<SignInOutputDto>;
  signUp: (signUpDto: SignUpInputDto) => Promise<SignUpOutputDto>;
  refresh: (refreshDto: RefreshInputDto) => Promise<SignInOutputDto>;
};

export type AuthController = {
  signIn: (req: Request, res: Response) => Promise<void>;
  signUp: (req: Request, res: Response) => Promise<void>;
  refresh: (req: Request, res: Response) => Promise<void>;
};

export type SignInInputDto = {
  username: string;
  password: string;
};

export type SignInOutputDto = {
  accessToken: string;
  refreshToken: string;
};

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

export type RefreshInputDto = {
  refreshToken: string;
};
