// Errors.
import { BaseError } from './base';

export class UnauthorizedError extends BaseError {
  constructor(message: string, errors?: object[]) {
    super(message, 401, true, errors);
  }
}
