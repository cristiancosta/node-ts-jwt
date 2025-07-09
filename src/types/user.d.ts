import { Request, Response } from 'express';

export type UserRepository = {
  getUserById: (id: number) => Promise<UserDto | null>;
  getUserByUsername: (username: string) => Promise<UserDto | null>;
  createUser: (dto: CreateUserDto) => Promise<UserDto>;
  updateRefreshUuid: (id: number, uuid: string) => Promise<void>;
};

export type UserService = {
  getUser: (id: number) => Promise<GetUserOutputDto>;
};

export type UserController = {
  getUser: (req: Request, res: Response) => Promise<void>;
};

export type CreateUserDto = {
  username: string;
  password: string;
};

export type GetUserOutputDto = {
  id: number;
  username: string;
  createdAt: Date;
  updatedAt: Date;
};

export type UserDto = {
  id: number;
  username: string;
  password: string;
  refreshUuid: string;
  createdAt: Date;
  updatedAt: Date;
};
