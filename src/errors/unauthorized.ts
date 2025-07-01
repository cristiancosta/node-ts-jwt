// Constants.
import { httpStatusCode } from '../constants/http-status-code';

// Errors.
import { BaseError } from './base';

export class UnauthorizedError extends BaseError {
  constructor(message: string, errors?: object[]) {
    super(message, httpStatusCode.UNAUTHORIZED, true, errors);
  }
}
