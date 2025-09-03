import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { divisionServices } from "./division.service";

const createDivision = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const division = await divisionServices.createDivision(req.body);
      sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Division create successfully",
        data: division,
      });
    } catch (err) {
      next(err);
    }
  }
);

const getAllDivisions = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const divisons = await divisionServices.getAllDivisions();
      sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "All Divisions get successfully!",
        data: divisons,
      });
    } catch (error) {
      next(error);
    }
  }
);

const getSingleDivision = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const slug = req.params.slug;
      const division = await divisionServices.getSingleDivision(slug);
      sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "single division get successfully",
        data: division,
      });
    } catch (error) {
      next(error);
    }
  }
);

const updateDivision = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const result = await divisionServices.updateDivision(id, req.body);
      sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "division update successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
);

const deleteDivision = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const deleteDivision = await divisionServices.deleteDivision(id);
      sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "division deleted successfully!",
        data: deleteDivision,
      });
    } catch (error) {
      next(error);
    }
  }
);
export const divisionController = {
  createDivision,
  getAllDivisions,
  getSingleDivision,
  updateDivision,
  deleteDivision,
};
