import mongoose from "mongoose";
import { IGenericErrorResponse } from "../interface/error.types";

export const handleCastError = (
  err: mongoose.Error.CastError
): IGenericErrorResponse => {
  console.log(err);
  return {
    statusCode: 400,
    message: "Invalid ObjectId. Please provide a valid id.",
  };
};
