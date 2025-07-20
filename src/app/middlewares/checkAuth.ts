import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import jwt, { JwtPayload } from "jsonwebtoken";
import { envVers } from "../config/env";

export const checkAuth =
  (...authRoles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        throw new AppError(httpStatus.BAD_REQUEST, "unauthorized access!");
      }
      const verifiedToken = jwt.verify(
        token as string,
        envVers.JWT_ACCESS_TOKEN_SECRET
      ) as JwtPayload;
      // console.log(verifiedToken);
      if (!authRoles.includes(verifiedToken.role)) {
        throw new AppError(httpStatus.BAD_REQUEST, "you are not authorized!");
      }
      req.user = verifiedToken;
      // console.log(verifiedToken);
      next();
    } catch (error) {
      next(error);
    }
  };
