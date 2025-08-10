import request from 'supertest';
import { sign, SignOptions } from 'jsonwebtoken';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { hashSync, compareSync } from 'bcryptjs';

// Configuration.
import { configuration } from '../../src/configuration';

// Models.
import { User } from '../../src/models/user';

// Utils.
import { createJwt } from '../../src/utils/create-jwt';
import { verifyJwt } from '../../src/utils/verify-jwt';

// Types.
import { SignInOutputDto } from '../../src/types/auth';
import { CreateJwtPayload } from '../../src/types/jwt';
import { TestContext } from './types/setup';

// Setup.
import { buildResources, teardownResources } from './setup';

describe('Auth', () => {
  let context: TestContext;

  beforeAll(async () => {
    context = await buildResources();
  }, 60_000);

  afterAll(async () => {
    if (context) {
      await teardownResources(context);
    }
  });

  describe('POST /auth/sign-in', () => {
    let userRepository: Repository<User>;

    beforeEach(async () => {
      userRepository = context.dataSource.getRepository(User);
      await userRepository.save({
        username: 'testuser',
        password: hashSync('Abcdef2!', 10)
      });
    });

    afterEach(async () => {
      await userRepository.clear();
    });

    it('Should return 404 status code and USER_NOT_FOUND message if user does not exist', async () => {
      const response = await request(context.app)
        .post('/auth/sign-in')
        .send({ username: 'nouser', password: 'Abcdef1!' });

      expect(response.status).toBe(404);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(response.body.message).toBe('USER_NOT_FOUND');
    });

    it('Should return 400 status code and INVALID_CREDENTIALS message if credentials are not valid', async () => {
      const response = await request(context.app)
        .post('/auth/sign-in')
        .send({ username: 'testuser', password: 'Abcdef1!' });

      expect(response.status).toBe(400);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(response.body.message).toBe('INVALID_CREDENTIALS');
    });

    it('Should return 200 status code and tokens if user exist and credentials are valid', async () => {
      const username = 'testuser';
      const password = 'Abcdef2!';
      const response = await request(context.app)
        .post('/auth/sign-in')
        .send({ username, password });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');

      const { accessToken, refreshToken } = response.body as SignInOutputDto;
      const verifiedAccessTokenJwt = verifyJwt(accessToken, {
        subject: 'ACCESS_TOKEN'
      });
      const verifiedRefreshTokenJwt = verifyJwt(refreshToken, {
        subject: 'REFRESH_TOKEN'
      });
      expect(verifiedAccessTokenJwt).toHaveProperty('id');
      expect(verifiedRefreshTokenJwt).toHaveProperty('id');
      expect(verifiedRefreshTokenJwt).toHaveProperty('uuid');

      const dbUser = await userRepository.findOne({ where: { username } });
      expect(verifiedRefreshTokenJwt.uuid).toEqual(dbUser!.refresh_uuid);
    });
  });

  describe('POST /auth/sign-up', () => {
    let userRepository: Repository<User>;

    beforeEach(async () => {
      userRepository = context.dataSource.getRepository(User);
      await userRepository.save({
        id: 50,
        username: 'testuser',
        password: hashSync('Abcdef2!', 10)
      });
    });

    afterEach(async () => {
      await userRepository.clear();
    });

    it('Should return 409 status code and USER_ALREADY_EXIST message if the given username was taken before', async () => {
      const response = await request(context.app)
        .post('/auth/sign-up')
        .send({ username: 'testuser', password: 'Abcdef1!' });

      expect(response.status).toBe(409);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(response.body.message).toBe('USER_ALREADY_EXIST');
    });

    it('Should return 200 status code and created user data', async () => {
      const username = 'testuser2';
      const password = 'Abcdef2!';
      const response = await request(context.app)
        .post('/auth/sign-up')
        .send({ username, password });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('username');
      expect(response.body).toHaveProperty('createdAt');
      expect(response.body).toHaveProperty('updatedAt');

      const dbUser = await userRepository.findOne({ where: { username } });
      expect(dbUser).not.toBeNull();
      expect(dbUser!.username).toBe(username);
      expect(dbUser!.password).not.toBe(password);
      expect(compareSync(password, dbUser!.password)).toBe(true);
    });
  });

  describe('POST /auth/refresh', () => {
    let userRepository: Repository<User>;

    beforeEach(async () => {
      userRepository = context.dataSource.getRepository(User);
      await userRepository.save({
        id: 100,
        username: 'testuser',
        password: hashSync('Abcdef2!', 10)
      });
    });

    afterEach(async () => {
      await userRepository.clear();
    });

    it('Should return 401 status code and TOKEN_EXPIRED message if refresh token is expired', async () => {
      const payload = { id: 1 };
      const { secret } = configuration.jwt;
      const options: SignOptions = {
        algorithm: 'HS512',
        subject: 'REFRESH_TOKEN',
        expiresIn: '1ms'
      };
      const refreshToken = sign(payload, secret, options);

      const response = await request(context.app)
        .post('/auth/refresh')
        .send({ refreshToken });

      expect(response.status).toBe(401);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(response.body.message).toBe('TOKEN_EXPIRED');
    });

    it('Should return 401 status code and INVALID_TOKEN message if refresh token is invalid', async () => {
      const payload = { id: 1 };
      const options: SignOptions = {
        algorithm: 'HS512',
        subject: 'REFRESH_TOKEN',
        expiresIn: '7d'
      };
      const refreshToken = sign(payload, 'invalid-secret', options);

      const response = await request(context.app)
        .post('/auth/refresh')
        .send({ refreshToken });

      expect(response.status).toBe(401);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(response.body.message).toBe('INVALID_TOKEN');
    });

    it('Should return 401 status code and INVALID_TOKEN message if refresh token has invalid subject', async () => {
      const payload = { id: 1 };
      const accessToken = createJwt(payload, { subject: 'ACCESS_TOKEN' });

      const response = await request(context.app)
        .post('/auth/refresh')
        .send({ refreshToken: accessToken });

      expect(response.status).toBe(401);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(response.body.message).toBe('INVALID_TOKEN');
    });

    it('Should return 401 status code and INVALID_USER_TOKEN message if refresh token does not belong to user', async () => {
      const uuid = uuidv4();
      const payload = { id: 1, uuid };
      const refreshToken = createJwt(payload, { subject: 'REFRESH_TOKEN' });
      await userRepository.update(100, { refresh_uuid: uuid });

      const response = await request(context.app)
        .post('/auth/refresh')
        .send({ refreshToken });

      expect(response.status).toBe(401);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(response.body.message).toBe('INVALID_USER_TOKEN');
    });

    it('Should return 200 status code and new tokens if refresh token has valid subject, valid content and user exist', async () => {
      const payload: CreateJwtPayload = { id: 100, uuid: uuidv4() };
      const refreshToken = createJwt(payload, { subject: 'REFRESH_TOKEN' });
      await userRepository.update(payload.id, { refresh_uuid: payload.uuid });

      const response = await request(context.app)
        .post('/auth/refresh')
        .send({ refreshToken });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
      expect((response.body as SignInOutputDto).refreshToken).toEqual(
        refreshToken
      );
      const user = await userRepository.findOne({ where: { id: payload.id } });
      expect(payload.uuid).not.toEqual(user!.refresh_uuid);
      const newRefreshToken = createJwt(
        {
          id: payload.id,
          uuid: user!.refresh_uuid
        },
        { subject: 'REFRESH_TOKEN' }
      );
      expect(refreshToken).not.toEqual(newRefreshToken);
    });
  });
});
