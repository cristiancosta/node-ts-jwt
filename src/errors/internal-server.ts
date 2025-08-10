// Errors.
import { BaseError } from './base';

export class InternalServerError extends BaseError {
  constructor(message: string, errors?: object[]) {
    super(message, 500, true, errors);
  }
}
