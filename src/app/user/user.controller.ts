/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";

import httpStatus from "http-status-codes";
import { UserServices } from "./user.service";
import { catchAsync } from "../utils/catchAsync";
import { success } from "zod";
import { sendResponse } from "../utils/sendResponse";

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
  allUser,
};
