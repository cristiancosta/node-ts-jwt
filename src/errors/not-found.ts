// Errors.
import { BaseError } from './base';

export class NotFoundError extends BaseError {
  constructor(message: string, errors?: object[]) {
    super(message, 404, true, errors);
  }
}
