import { SignOptions, VerifyOptions } from 'jsonwebtoken';

export type VerifyJwtOptions = Omit<
  VerifyOptions,
  'algorithms' | 'complete' | 'subject'
> & {
  subject: 'REFRESH_TOKEN' | 'ACCESS_TOKEN';
};

export type CreateJwtOptions = Omit<
  SignOptions,
  'algorithm' | 'expiresIn' | 'subject'
> & {
  subject: 'REFRESH_TOKEN' | 'ACCESS_TOKEN';
};
