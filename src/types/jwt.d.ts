import { SignOptions, VerifyOptions, JwtPayload } from 'jsonwebtoken';

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

export type CreateJwtPayload = {
  id: number;
  uuid?: string;
};

export interface VerifyJwtPayload extends JwtPayload {
  id: number;
  uuid?: string;
}
