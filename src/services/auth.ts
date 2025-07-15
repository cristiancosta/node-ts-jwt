import { v4 as uuidv4 } from 'uuid';
import { compareSync, hashSync } from 'bcryptjs';

// Constants.
import { errorMessage } from '../constants/error-message';

// Errors.
import { BadRequestError } from '../errors/bad-request';
import { ConflictError } from '../errors/conflict';
import { NotFoundError } from '../errors/not-found';
import { UnauthorizedError } from '../errors/unauthorized';

// Types.
import {
  AuthService,
  RefreshInputDto,
  SignInInputDto,
  SignInOutputDto,
  SignUpInputDto,
  SignUpOutputDto
} from '../types/auth';
import { UserRepository } from '../types/user';

// Utils.
import { createJwt } from '../utils/create-jwt';
import { verifyJwt } from '../utils/verify-jwt';

export const authService = (userRepository: UserRepository): AuthService => {
  const signIn = async (
    signInDto: SignInInputDto
  ): Promise<SignInOutputDto> => {
    const { username, password } = signInDto;
    const user = await userRepository.getUserByUsername(username.trim());
    if (!user) {
      throw new NotFoundError(errorMessage.USER_NOT_FOUND);
    }
    const isValidPassword = compareSync(password.trim(), user.password);
    if (!isValidPassword) {
      throw new BadRequestError(errorMessage.INVALID_CREDENTIALS);
    }
    const accessToken = createJwt({ id: user.id }, { subject: 'ACCESS_TOKEN' });
    const uuid = uuidv4();
    const refreshToken = createJwt(
      { id: user.id, uuid },
      { subject: 'REFRESH_TOKEN' }
    );
    await userRepository.updateRefreshUuid(user.id, uuid);
    return { accessToken, refreshToken };
  };

  const signUp = async (
    signUpDto: SignUpInputDto
  ): Promise<SignUpOutputDto> => {
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

  const refresh = async (
    refreshDto: RefreshInputDto
  ): Promise<SignInOutputDto> => {
    const { refreshToken } = refreshDto;
    const { id, uuid } = verifyJwt(refreshToken, { subject: 'REFRESH_TOKEN' });
    const user = await userRepository.getUserByIdAndRefreshUuid(id, uuid!);
    if (!user) {
      throw new UnauthorizedError(errorMessage.INVALID_USER_TOKEN);
    }
    const newAccessToken = createJwt(
      { id: user.id },
      { subject: 'ACCESS_TOKEN' }
    );
    const newUuid = uuidv4();
    const newRefreshToken = createJwt(
      { id: user.id, uuid },
      { subject: 'REFRESH_TOKEN' }
    );
    await userRepository.updateRefreshUuid(user.id, newUuid);
    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  };

  return {
    signIn,
    signUp,
    refresh
  };
};
