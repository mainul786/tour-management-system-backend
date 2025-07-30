import { JwtPayload } from "jsonwebtoken";
import { envVers } from "../config/env";
import { IsActive, IUser } from "../modules/user/user.interface";
import { generateToken, verifyToken } from "./jwt";
import AppError from "../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import { User } from "../modules/user/user.model";

export const createUserToken = (user: Partial<IUser>) => {
  const jwtPayload = {
    userId: user._id,
    email: user.email,
    role: user.role,
  };
  const accessToken = generateToken(
    jwtPayload,
    envVers.JWT_ACCESS_TOKEN_SECRET,
    envVers.JWT_ACCESS_TOKEN_SECRET_EXPIRE
  );
  const refreshToken = generateToken(
    jwtPayload,
    envVers.JWT_REFRESH_TOKEN_SECRET,
    envVers.JWT_REFRESH_TOKEN_SECRET_EXPIRE
  );

  return {
    accessToken,
    refreshToken,
  };
};

export const newAccessTokenWithRefreshToken = async (refreshToken: string) => {
  const verifiedRefreshToken = verifyToken(
    refreshToken,
    envVers.JWT_REFRESH_TOKEN_SECRET
  ) as JwtPayload;

  const isUserExist = await User.findOne({ email: verifiedRefreshToken.email });
  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User does not Exists!");
  }
  if (
    isUserExist.isActive === IsActive.BLOCKED ||
    isUserExist.isActive === IsActive.INACTIVE
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `user is ${isUserExist.isActive}`
    );
  }
  if (isUserExist.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, "user is deleted");
  }

  const jwtPayload = {
    userId: isUserExist._id,
    email: isUserExist.email,
    role: isUserExist.role,
  };

  const accessToken = generateToken(
    jwtPayload,
    envVers.JWT_ACCESS_TOKEN_SECRET,
    envVers.JWT_ACCESS_TOKEN_SECRET_EXPIRE
  );
  return accessToken;
};
