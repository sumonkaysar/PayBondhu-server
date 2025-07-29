import { compare } from "bcryptjs";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "../../utils/httpStatus";
import { createUserTokens } from "../../utils/userTokens";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";

const credentialsLogin = async (payload: IUser) => {
  const isUserExist = await User.findOne({
    phoneNumber: payload.phoneNumber,
  }).select("+password");

  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Wrong credentials");
  }

  const isPasswordMatched = await compare(
    payload.password,
    isUserExist.password
  );

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.BAD_REQUEST, "Wrong credentials");
  }

  const tokens = await createUserTokens(isUserExist);

  isUserExist.password = "";

  return {
    user: isUserExist,
    ...tokens,
  };
};

export const AuthServices = {
  credentialsLogin,
};
