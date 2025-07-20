import AppError from "../../errorHelpers/AppError";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import httpStatus from "http-status-codes";
import bcrypt from "bcryptjs";

import { generateToken } from "../../utils/jwt";

import { envVers } from "./../../config/env";

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

  const jwtPayload = {
    userId: isUserExist._id,
    email: isUserExist.email,
    role: isUserExist.role,
  };

  // const accessToken = jwt.sign(jwtPayload, "secret", { expiresIn: "1d" });
  const accessToken = generateToken(
    jwtPayload,
    envVers.JWT_ACCESS_TOKEN_SECRET,
    envVers.JWT_ACCESS_TOKEN_SECRET_EXPIRE
  );

  return {
    accessToken,
  };
};
export const AuthServices = {
  userCredentialLogin,
};
