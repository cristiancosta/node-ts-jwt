import { DataSource, Like } from 'typeorm';
import { errorMessage } from '../constants';
import { InternalServerError } from '../errors/internal-server';
import { User } from '../models/user';
import { UserRepository, UserDto, CreateUserDto } from '../types/user';

const userRepository = (dataSource: DataSource): UserRepository => {
  const repository = dataSource.getRepository(User);

  const getUserByUsername = async (username: string) => {
    try {
      const user = await repository.findOne({
        where: { username: Like(username) }
      });
      const result = user ? mapUserModelToUserDto(user) : null;
      return result;
    } catch (error) {
      console.error('getUserByUsername#error', error);
      throw new InternalServerError(errorMessage.USER_RETRIEVAL_FAILURE);
    }
  };
  const getUserById = async (id: number) => {
    try {
      const user = await repository.findOne({ where: { id } });
      const result = user ? mapUserModelToUserDto(user) : null;
      return result;
    } catch (error) {
      console.error('getUserById#error', error);
      throw new InternalServerError(errorMessage.USER_RETRIEVAL_FAILURE);
    }
  };
  const createUser = (dto: CreateUserDto) => {
    try {
      const { username, password } = dto;
      const user = repository.create({ username, password });
      return mapUserModelToUserDto(user);
    } catch (error) {
      console.error('createUser#error', error);
      throw new InternalServerError(errorMessage.USER_CREATION_FAILURE);
    }
  };
  const mapUserModelToUserDto = (userModel: User) => {
    const userDto: UserDto = {
      id: userModel.id,
      username: userModel.username,
      password: userModel.password,
      refreshUuid: userModel.refresh_uuid,
      createdAt: userModel.created_at,
      updatedAt: userModel.created_at
    };
    return userDto;
  };
  return {
    getUserByUsername,
    getUserById,
    createUser
  };
};

export default userRepository;
