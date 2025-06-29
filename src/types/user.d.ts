export type UserRepository = {
  getUserById: (id: number) => Promise<UserDto | null>;
  getUserByUsername: (username: string) => Promise<UserDto | null>;
  createUser: (dto: CreateUserDto) => UserDto;
};

export type CreateUserDto = {
  username: string;
  password: string;
};

export type UserDto = {
  id: number;
  username: string;
  password: string;
  refreshUuid: string;
  createdAt: Date;
  updatedAt: Date;
};
