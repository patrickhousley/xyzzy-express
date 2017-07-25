import * as express from 'express';
import { ORMErrorNameEnum } from 'src/server/shared/errors/ORMError.interface';

export const ormErrorHandler: express.ErrorRequestHandler = (
  error: Error,
  _req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (!error || !error.name) {
    next();
  } else if (Object.keys(ORMErrorNameEnum).includes(error.name)) {
    res.status(res.statusCode === 207 ? res.statusCode : 503).send({
      errorCode: 'ORM_SERVER_ERROR',
      errorMessage: 'An internal server error occurred accessing the database.'
    });
  } else {
    next(error);
  }
};
