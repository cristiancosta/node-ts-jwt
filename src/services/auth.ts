import { hashSync } from 'bcryptjs';
import { ConflictError } from '../errors/conflict';
import { SignUpDto } from '../types/auth';
import { UserRepository } from '../types/user';
import { errorMessage } from '../constants/error-message';

export const authService = (userRepository: UserRepository) => {
  const signUp = async (signUpDto: SignUpDto) => {
    const { username, password } = signUpDto;
    const user = await userRepository.getUserByUsername(username.trim());
    if (user) {
      throw new ConflictError(errorMessage.USER_ALREADY_EXIST);
    }
    const hashedPassword = hashSync(password.trim());
    const createdUser = await userRepository.createUser({
      username: username.trim(),
      password: hashedPassword
    });
    return {
      id: createdUser.id,
      username: createdUser.username,
      createdAt: createdUser.createdAt,
      updatedAt: createdUser.updatedAt
    };
  };

  return {
    signUp
  };
};
