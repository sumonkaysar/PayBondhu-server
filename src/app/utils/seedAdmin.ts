/* eslint-disable no-console */
import envVars from "../config/env.config";
import { IUser, Role, Status } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";

const seedAdmin = async () => {
  try {
    const isAdminExist = await User.findOne({
      phoneNumber: envVars.ADMIN_PHONE,
    });

    if (isAdminExist) {
      console.log("Admin already exists!");
      return;
    }

    console.log("Trying to create Admin...");

    // const password = await hash(
    //   envVars.ADMIN_PASS,
    //   Number(envVars.BCRYPTJS_SALT_ROUND)
    // );
    // console.log(envVars.ADMIN_PASS, password);

    const payload: IUser = {
      name: "Admin",
      phoneNumber: envVars.ADMIN_PHONE,
      password: envVars.ADMIN_PASS,
      role: Role.ADMIN,
      status: Status.ACTIVE,
    };

    await User.create(payload);

    console.log("Admin created successfully");
  } catch (error) {
    console.log(error);
  }
};

export default seedAdmin;
