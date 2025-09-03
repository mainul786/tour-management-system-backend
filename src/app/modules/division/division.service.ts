import AppError from "../../errorHelpers/AppError";
import { IDivision } from "./division.interface";
import { Division } from "./division.model";
import httpStatus, { StatusCodes } from "http-status-codes";

const createDivision = async (payload: IDivision) => {
  // const baseSlug = payload.name.toLocaleLowerCase().split(" ").join("-");
  // let slug = `${baseSlug}-division`;

  // let counter = 0;
  // while (await Division.exists({ slug })) {
  //   slug = `${slug}-${counter++}`;
  // }
  const existsName = await Division.findOne({ name: payload.name });
  if (existsName) {
    throw new AppError(
      httpStatus.OK,
      "Division name already exist you cant add this division"
    );
  }
  const existsSlug = await Division.findOne({ slug: payload.slug });
  if (existsSlug) {
    throw new AppError(httpStatus.BAD_REQUEST, "this slug is already exist!");
  }
  const division = await Division.create(payload);
  return division;
};

const getAllDivisions = async () => {
  const division = await Division.find({});
  const countDivision = await Division.countDocuments();
  return {
    data: division,
    meta: {
      total: countDivision,
    },
  };
};

const getSingleDivision = async (slug: string) => {
  const division = await Division.findOne({ slug });
  if (!division) {
    throw new AppError(StatusCodes.BAD_REQUEST, "division doet not exists!");
  }
  return division;
};

const updateDivision = async (id: string, payload: Partial<IDivision>) => {
  const existsDivision = await Division.findById({ _id: id });
  if (!existsDivision) {
    throw new AppError(httpStatus.BAD_REQUEST, "division does not exists!");
  }
  const duplicateDivision = await Division.findOne({
    name: payload.name,
    _id: { $ne: id },
  });
  if (duplicateDivision) {
    throw new Error("a division with this name already exists");
  }
  const result = await Division.findByIdAndUpdate(id, payload, {
    new: true,
    runValidatores: true,
  });
  return result;
};

const deleteDivision = async (id: string) => {
  await Division.findByIdAndDelete({ _id: id });
  return null;
};

export const divisionServices = {
  createDivision,
  getAllDivisions,
  getSingleDivision,
  updateDivision,
  deleteDivision,
};
