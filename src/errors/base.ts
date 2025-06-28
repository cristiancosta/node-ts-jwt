export class BaseError extends Error {
  public readonly message: string;
  public readonly httpCode: number;
  public readonly isOperational: boolean;
  public readonly errors: object[];

  constructor(
    message: string,
    httpCode: number,
    isOperational: boolean,
    errors: object[] = []
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);

    this.message = message;
    this.httpCode = httpCode;
    this.isOperational = isOperational;
    this.errors = errors;
  }
}
