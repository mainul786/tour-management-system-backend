import AppError from "../../errorHelpers/AppError";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import httpStatus from "http-status-codes";
import bcrypt from "bcryptjs";
import {
  createUserToken,
  newAccessTokenWithRefreshToken,
} from "../../utils/userTokens";
import { envVers } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

const userCredentialLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;
  //   console.log(email);
  const isUserExist = await User.findOne({ email });
  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User does not Exists!");
  }
  const passwordMatch = await bcrypt.compare(
    password as string,
    isUserExist?.password as string
  );
  if (!passwordMatch) {
    throw new AppError(httpStatus.BAD_REQUEST, "your password does not match");
  }

  // const jwtPayload = {
  //   userId: isUserExist._id,
  //   email: isUserExist.email,
  //   role: isUserExist.role,
  // };

  // // const accessToken = jwt.sign(jwtPayload, "secret", { expiresIn: "1d" });
  // const accessToken = generateToken(
  //   jwtPayload,
  //   envVers.JWT_ACCESS_TOKEN_SECRET,
  //   envVers.JWT_ACCESS_TOKEN_SECRET_EXPIRE
  // );

  // const refreshToken = generateToken(
  //   jwtPayload,
  //   envVers.JWT_REFRESH_TOKEN_SECRET,
  //   envVers.JWT_REFRESH_TOKEN_SECRET_EXPIRE
  // );
  const userTokens = createUserToken(isUserExist);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: pass, ...rest } = isUserExist.toObject();
  return {
    accessToken: userTokens.accessToken,
    refreshToken: userTokens.refreshToken,
    user: rest,
  };
};
const getNewAccessToken = async (refreshToken: string) => {
  const newAccessToken = await newAccessTokenWithRefreshToken(refreshToken);
  return {
    accessToken: newAccessToken,
  };
};

const resetPassword = async (
  oldPassword: string,
  newPaaword: string,
  decodedToken: JwtPayload
) => {
  const user = await User.findById(decodedToken.userId);
  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, "user does not exists!");
  }
  const oldPasswordMatched = await bcrypt.compare(
    oldPassword,
    user.password as string
  );
  if (!oldPasswordMatched) {
    throw new AppError(httpStatus.BAD_REQUEST, "old password does not match!");
  }
  user.password = await bcrypt.hash(
    newPaaword,
    Number(envVers.PASSWORD_HASH_SALT_ROUND)
  );
  user.save();
};

export const AuthServices = {
  userCredentialLogin,
  getNewAccessToken,
  resetPassword,
};
