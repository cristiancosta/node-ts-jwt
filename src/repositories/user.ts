import { DataSource, Like } from 'typeorm';

// Errors.
import { InternalServerError } from '../errors/internal-server';

// Models.
import { User } from '../models/user';

// Types.
import { UserRepository, UserDto, CreateUserDto } from '../types/user';

export const userRepository = (dataSource: DataSource): UserRepository => {
  const repository = dataSource.getRepository(User);

  const getUserByUsername = async (
    username: string
  ): Promise<UserDto | null> => {
    try {
      const user = await repository.findOne({
        where: { username: Like(username) }
      });
      const result = user ? mapUserModelToUserDto(user) : null;
      return result;
    } catch (error) {
      console.error('getUserByUsername#error', error);
      throw new InternalServerError('USER_RETRIEVAL_FAILURE');
    }
  };

  const getUserById = async (id: number): Promise<UserDto | null> => {
    try {
      const user = await repository.findOne({ where: { id } });
      const result = user ? mapUserModelToUserDto(user) : null;
      return result;
    } catch (error) {
      console.error('getUserById#error', error);
      throw new InternalServerError('USER_RETRIEVAL_FAILURE');
    }
  };

  const createUser = async (dto: CreateUserDto): Promise<UserDto> => {
    try {
      const { username, password } = dto;
      const user = await repository.save({ username, password });
      return mapUserModelToUserDto(user);
    } catch (error) {
      console.error('createUser#error', error);
      throw new InternalServerError('USER_CREATION_FAILURE');
    }
  };

  const getUserByIdAndRefreshUuid = async (
    id: number,
    uuid: string
  ): Promise<UserDto | null> => {
    try {
      const user = await repository.findOne({
        where: { id, refresh_uuid: uuid }
      });
      const result = user ? mapUserModelToUserDto(user) : null;
      return result;
    } catch (error) {
      console.error('getUserByIdAndRefreshUuid#error', error);
      throw new InternalServerError('USER_RETRIEVAL_FAILURE');
    }
  };

  const updateRefreshUuid = async (id: number, uuid: string): Promise<void> => {
    try {
      await repository.update(id, { refresh_uuid: uuid });
    } catch (error) {
      console.error('updateRefreshUuid#error', error);
      throw new InternalServerError('USER_UPDATE_FAILURE');
    }
  };

  const mapUserModelToUserDto = (userModel: User): UserDto => {
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
    createUser,
    updateRefreshUuid,
    getUserByIdAndRefreshUuid
  };
};
