/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { envVers } from "../config/env";
import AppError from "../errorHelpers/AppError";
import mongoose from "mongoose";
import { handleDuplicateError } from "../helpers/handleDuplicateError";
import { handleCastError } from "../helpers/handleCastError";
import { handleValidationError } from "../helpers/handleValidationError";
import { handleZodError } from "../helpers/handleZodError";
import { IErrorSources } from "../interface/error.types";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (envVers.NODE_ENV === "development") {
    console.log(err);
  }
  let statusCode = 500;
  let message = "something went is wrong ";
  let errorSources: IErrorSources[] = [];
  if (err.code === 11000) {
    const simplified = handleDuplicateError(err);
    statusCode = simplified.statusCode;
    message = simplified.message;
  } else if (err.name === "CastError") {
    const simplified = handleCastError(err);
    statusCode = simplified.statusCode;
    message = simplified.message;
  } else if (err.name === "ValidationError") {
    const simplified = handleValidationError(err);
    statusCode = simplified.statusCode;
    message = simplified.message;
    errorSources = simplified.errorSources as IErrorSources[];
  } else if (err.name === "ZodError") {
    const simplified = handleZodError(err);
    statusCode = simplified.statusCode;
    message = simplified.message;
    errorSources = simplified.errorSources as IErrorSources[];
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof Error) {
    statusCode = 500;
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    err: envVers.NODE_ENV === "development" ? err : null,
    stack: envVers.NODE_ENV === "development" ? err.stack : null,
  });
};
