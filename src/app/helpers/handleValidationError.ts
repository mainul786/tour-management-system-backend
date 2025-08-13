/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";
import { IErrorSources, IGenericErrorResponse } from "../interface/error.types";

export const handleValidationError = (
  err: mongoose.Error.ValidationError
): IGenericErrorResponse => {
  const errorSources: IErrorSources[] = [];
  const errors = Object.values(err.errors);
  errors.forEach((err: any) =>
    errorSources.push({
      path: err.path,
      message: err.message,
    })
  );
  return {
    statusCode: 400,
    message: "Validation Error",
    errorSources,
  };
};
