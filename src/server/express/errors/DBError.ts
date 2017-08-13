import { HttpError } from 'routing-controllers';

export class DBError extends HttpError {
  public name = 'DBError';

  constructor(
    httpCode = 500,
    message = 'An internal server error occurred accessing the database.'
  ) {
    super(httpCode, message);
  }
}
