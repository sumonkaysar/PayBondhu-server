import { IUser } from "./user.interface";

const createUser = (payload: IUser) => {
  return payload;
};

export const UserServices = {
  createUser,
};
