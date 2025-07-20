/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { AuthServices } from "./auth.service";

const userCredentialLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // console.log(req.body);
    const loginInfo = await AuthServices.userCredentialLogin(req.body);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User Login successfully!",
      data: loginInfo,
    });
  }
);
export const AuthControllers = {
  userCredentialLogin,
};
