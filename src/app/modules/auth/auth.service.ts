import { compare, hash } from "bcryptjs";
import { JwtPayload } from "jsonwebtoken";
import { Document } from "mongoose";
import envVars from "../../config/env.config";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "../../utils/httpStatus";
import {
  createNewAccessTokenWithRefreshToken,
  createUserTokens,
} from "../../utils/userTokens";
import { IUser, Role, Status } from "../user/user.interface";
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

  if (
    isUserExist.role === Role.AGENT &&
    isUserExist.status === Status.PENDING
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Your account is pending, please wait for admin approval"
    );
  }

  const tokens = await createUserTokens(isUserExist);

  isUserExist.password = "";

  return {
    user: isUserExist,
    ...tokens,
  };
};

const resetPassword = async (
  decoded: JwtPayload,
  newPassword: string,
  oldPassword: string
) => {
  const user = (await User.findById(decoded.userId)) as Document & IUser;

  const isOldPasswordMatched = await compare(
    oldPassword,
    user.password as string
  );

  if (!isOldPasswordMatched) {
    throw new AppError(httpStatus.BAD_REQUEST, "Old password does not match");
  }

  user.password = await hash(newPassword, Number(envVars.BCRYPTJS_SALT_ROUND));

  await user.save();
};

const getNewAccessToken = async (refreshToken: string) => {
  const accessToken = await createNewAccessTokenWithRefreshToken(refreshToken);
  return { accessToken };
};

export const AuthServices = {
  credentialsLogin,
  resetPassword,
  getNewAccessToken,
};
