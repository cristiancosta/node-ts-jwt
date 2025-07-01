import expressBasicAuth from 'express-basic-auth';

// Configuration.
import { configuration } from '../configuration';

const { username, password } = configuration.swagger;

export const swaggerBasicAuth = expressBasicAuth({
  users: { [username]: password },
  challenge: true
});
