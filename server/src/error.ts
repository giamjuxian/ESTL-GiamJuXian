import { NextFunction, Request, Response } from "express";

/**
 * Custom error class so that we can include more information into the error
 * that we throw
 */
export class HttpError extends Error {
  status: number;
  message: string;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.message = message;
  }
}

/**
 * Error handling middleware to be used by the express server
 */
export function handleError(
  error: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const status = error.status || 500;
  const message = error.message || "Something went wrong";
  res.status(status).send({
    error: {
      status,
      message,
    },
  });
}
