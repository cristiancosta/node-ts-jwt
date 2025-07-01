// Constants.
import { httpStatusCode } from '../constants/http-status-code';

// Errors.
import { BaseError } from './base';

export class InternalServerError extends BaseError {
  constructor(message: string, errors?: object[]) {
    super(message, httpStatusCode.INTERNAL_SERVER_ERROR, true, errors);
  }
}
