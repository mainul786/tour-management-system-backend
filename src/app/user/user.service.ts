import { IUser } from "./user.interface";
import { User } from "./user.model";

const createUser = async (payload: Partial<IUser>) => {
  const { name, email } = payload;
  const user = await User.create({ name, email });
  return user;
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
  allUser,
};
