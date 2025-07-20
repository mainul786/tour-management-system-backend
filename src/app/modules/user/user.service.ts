import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes";
import bcrypt from "bcryptjs";
import { envVers } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;
  const isUserExits = await User.findOne({ email });
  if (isUserExits) {
    throw new AppError(httpStatus.BAD_REQUEST, "user already Exits");
  }
  const authProvider: IAuthProvider = {
    provider: "credentials",
    providerId: email as string,
  };

  const hashPassword = await bcrypt.hash(
    password as string,
    Number(envVers.PASSWORD_HASH_SALT_ROUND)
  );

  const user = await User.create({
    email,
    password: hashPassword,
    auths: [authProvider],
    ...rest,
  });
  return user;
};

const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload
) => {
  const isUserExits = await User.findById(userId);
  if (!isUserExits) {
    throw new AppError(httpStatus.NOT_FOUND, "user does not exists");
  }
  if (payload.role) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
      throw new AppError(httpStatus.FORBIDDEN, "you are not authorized.");
    }
    if (payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN) {
      throw new AppError(httpStatus.FORBIDDEN, "you are not authorized.");
    }
  }
  if (payload.isActive || payload.isVerified || payload.isDeleted) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
    }
  }
  if (payload.password) {
    payload.password = await bcrypt.hash(
      payload.password,
      Number(envVers.PASSWORD_HASH_SALT_ROUND)
    );
  }
  const newUpdate = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });
  return newUpdate;
};

const allUser = async () => {
  const users = await User.find({});
  const total = await User.countDocuments();
  return {
    data: users,
    meta: {
      total: total,
    },
  };
};
export const UserServices = {
  createUser,
  updateUser,
  allUser,
};
