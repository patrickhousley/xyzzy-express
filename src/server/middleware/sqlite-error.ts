import * as express from 'express';
import {
  SQLiteError,
  SQLiteServerErrorsEnum,
  SQLiteValidationErrorsEnum
} from 'src/server/shared/errors/SQLiteError.interface';

export const sqliteErrorHandler: express.ErrorRequestHandler = (
  error: Error,
  _req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (!error || !(error as SQLiteError).code) {
    next(error);
  } else if (
    Object.keys(SQLiteServerErrorsEnum).includes((error as SQLiteError).code)
  ) {
    res.status(res.statusCode === 207 ? res.statusCode : 503).send({
      errorCode: 'DB_SERVER_ERROR',
      errorMessage: 'An internal server error occurred accessing the database.'
    });
  } else if (
    Object.keys(SQLiteValidationErrorsEnum).includes(
      (error as SQLiteError).code
    )
  ) {
    res.status(res.statusCode === 207 ? res.statusCode : 422).send({
      errorCode: 'DB_VALIDATION_ERROR',
      errorMessage: 'An internal server error occurred accessing the database.'
    });
  } else {
    next(error);
  }
};
