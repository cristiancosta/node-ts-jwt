import request from 'supertest';
import { Repository } from 'typeorm';

// Constants.
import { errorMessage } from '../../src/constants/error-message';
import { httpStatusCode } from '../../src/constants/http-status-code';

// Models.
import { User } from '../../src/models/user';

// Utils.
import { createJwt } from '../../src/utils/create-jwt';

// Types.
import { CreateJwtPayload } from '../../src/types/jwt';
import { GetUserOutputDto } from '../../src/types/user';
import { TestContext } from './types/setup';

// Setup.
import { buildResources, teardownResources } from './setup';

describe('User', () => {
  let context: TestContext;

  beforeAll(async () => {
    context = await buildResources();
  }, 60_000);

  afterAll(async () => {
    if (context) {
      await teardownResources(context);
    }
  });

  describe('GET /user/:id', () => {
    let userRepository: Repository<User>;
    const payload: CreateJwtPayload = { id: 1 };
    const accessToken = createJwt(payload, { subject: 'ACCESS_TOKEN' });

    beforeEach(async () => {
      userRepository = context.dataSource.getRepository(User);
      await userRepository.save({
        id: 1,
        username: 'testuser',
        password: 'hashedpassword'
      });
    });

    afterEach(async () => {
      await userRepository.clear();
    });

    it('Should return 404 status code and USER_NOT_FOUND message if user does not exist', async () => {
      const response = await request(context.app)
        .get('/user/2')
        .set('authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(httpStatusCode.NOT_FOUND);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(response.body.message).toBe(errorMessage.USER_NOT_FOUND);
    });

    it('Should return 200 status code and user information', async () => {
      const response = await request(context.app)
        .get('/user/1')
        .set('authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(httpStatusCode.OK);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('username');
      expect(response.body).toHaveProperty('createdAt');
      expect(response.body).toHaveProperty('updatedAt');

      const { id, username } = response.body as GetUserOutputDto;
      expect(id).toBe(1);
      expect(username).toBe('testuser');
    });
  });
});
