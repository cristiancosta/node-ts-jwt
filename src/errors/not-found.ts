// Constants.
import { httpStatusCode } from '../constants';

// Errors.
import { BaseError } from './base';

export class NotFoundError extends BaseError {
  constructor(message: string, errors?: object[]) {
    super(message, httpStatusCode.NOT_FOUND, true, errors);
  }
}
