import request from 'supertest';
import { Repository } from 'typeorm';
import { hashSync, compareSync } from 'bcryptjs';

// Constants.
import { errorMessage } from '../../src/constants/error-message';
import { httpStatusCode } from '../../src/constants/http-status-code';

// Models.
import { User } from '../../src/models/user';

// Utils.
import { verifyJwt } from '../../src/utils/verify-jwt';

// Types.
import { SignInOutputDto } from '../../src/types/auth';
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

      expect(response.status).toBe(httpStatusCode.NOT_FOUND);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(response.body.message).toBe(errorMessage.USER_NOT_FOUND);
    });

    it('Should return 400 status code and INVALID_CREDENTIALS message if credentials are not valid', async () => {
      const response = await request(context.app)
        .post('/auth/sign-in')
        .send({ username: 'testuser', password: 'Abcdef1!' });

      expect(response.status).toBe(httpStatusCode.BAD_REQUEST);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(response.body.message).toBe(errorMessage.INVALID_CREDENTIALS);
    });

    it('Should return 200 status code and tokens if user exist and credentials are valid', async () => {
      const username = 'testuser';
      const password = 'Abcdef2!';
      const response = await request(context.app)
        .post('/auth/sign-in')
        .send({ username, password });

      expect(response.status).toBe(httpStatusCode.OK);
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

      expect(response.status).toBe(httpStatusCode.CONFLICT);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(response.body.message).toBe(errorMessage.USER_ALREADY_EXIST);
    });

    it('Should return 200 status code and created user data', async () => {
      const username = 'testuser2';
      const password = 'Abcdef2!';
      const response = await request(context.app)
        .post('/auth/sign-up')
        .send({ username, password });

      expect(response.status).toBe(httpStatusCode.OK);
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
});
