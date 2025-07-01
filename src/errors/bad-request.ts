// Constants.
import { httpStatusCode } from '../constants/http-status-code';

// Errors.
import { BaseError } from './base';

export class BadRequestError extends BaseError {
  constructor(message: string, errors?: object[]) {
    super(message, httpStatusCode.BAD_REQUEST, true, errors);
  }
}
