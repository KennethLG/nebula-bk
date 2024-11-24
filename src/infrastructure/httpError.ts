import { NextFunction, Request, Response } from "express";

export class ApplicationError extends Error {
  constructor(public readonly message: string, public readonly statusCode: number) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends ApplicationError {
  constructor(message: string) {
    super(message, 404);
  }
}

export class InvalidCredentialsError extends ApplicationError {
  constructor() {
    super("Invalid email or password", 401);
  }
}

export class ConflictError extends ApplicationError {
  constructor(message: string) {
    super(message, 409);
  }
}

export class InternalServerError extends ApplicationError {
  constructor() {
    super("Internal Server Error", 500);
  }
}

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof ApplicationError) {
    res.status(err.statusCode).json({ error: err.message });
  } else {
    console.error("Unexpected error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
