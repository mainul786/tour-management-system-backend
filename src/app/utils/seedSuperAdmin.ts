import { envVers } from "../config/env";
import {
  IAuthProvider,
  IsActive,
  IUser,
  Role,
} from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import bcrypt from "bcryptjs";

export const seedSuperAdmin = async () => {
  try {
    const isSuperAdminExits = await User.findOne({
      email: envVers.SUPER_ADMIN_EMAIL,
    });
    if (isSuperAdminExits) {
      console.log("Super admin already exists");
      return;
    }
    const passwordHash = await bcrypt.hash(
      envVers.SUPER_ADMIN_PASSWORD,
      Number(envVers.PASSWORD_HASH_SALT_ROUND)
    );
    const authProvider: IAuthProvider = {
      provider: "credentials",
      providerId: envVers.SUPER_ADMIN_EMAIL,
    };
    const payload: IUser = {
      name: "super Admin",
      role: Role.SUPER_ADMIN,
      email: envVers.SUPER_ADMIN_EMAIL,
      password: passwordHash,
      isDeleted: false,
      isActive: IsActive.ACTIVE,
      isVerified: true,
      auths: [authProvider],
    };

    await User.create(payload);
  } catch (error) {
    console.log(error);
  }
};
