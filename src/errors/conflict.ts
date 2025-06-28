// Constants.
import { httpStatusCode } from '../constants';

// Errors.
import { BaseError } from './base';

export class ConflictError extends BaseError {
  constructor(message: string, errors?: object[]) {
    super(message, httpStatusCode.CONFLICT, true, errors);
  }
}
