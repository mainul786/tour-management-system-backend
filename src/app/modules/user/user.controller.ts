/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";

import { UserServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import jwt, { JwtPayload } from "jsonwebtoken";
import { envVers } from "../../config/env";
import httpStatus from "http-status-codes";

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await UserServices.createUser(req.body);
    res.status(httpStatus.CREATED).json({
      message: "user created successfully!!",
      user,
    });
  } catch (err: any) {
    res.status(httpStatus.BAD_REQUEST).json({
      message: `Somethinng went is Wrong ${err}`,
      err,
    });
    next(err);
  }
};

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.params.id;
  // const token = req.headers.authorization;
  // const verifiedToken = (await jwt.verify(
  //   token as string,
  //   envVers.JWT_ACCESS_TOKEN_SECRET
  // )) as JwtPayload;
  const verifiedToken = req.user;
  const payload = req.body;

  const user = await UserServices.updateUser(userId, payload, verifiedToken);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User update successfully",
    data: user,
  });
};

const allUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserServices.allUser();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Get All user successfully!",
      data: result,
      meta: result.meta,
    });
  }
);

export const userControllers = {
  createUser,
  updateUser,
  allUser,
};
