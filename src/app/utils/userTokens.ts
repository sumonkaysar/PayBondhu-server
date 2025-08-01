import { JwtPayload } from "jsonwebtoken";
import envVars from "../config/env.config";
import AppError from "../errorHelpers/AppError";
import { IUser, Status } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import httpStatus from "./httpStatus";
import { generateToken, verifyToken } from "./jwt";

export const createUserTokens = async (user: IUser) => {
  const jwtPayload = {
    userId: user._id,
    phoneNumber: user.phoneNumber,
    role: user.role,
  };

  const accessToken = generateToken(
    jwtPayload,
    envVars.JWT_SECRET,
    envVars.JWT_EXPIRES_IN
  );

  const refreshToken = generateToken(
    jwtPayload,
    envVars.JWT_REFRESH_SECRET,
    envVars.JWT_REFRESH_EXPIRES_IN
  );

  return { accessToken, refreshToken };
};

export const createNewAccessTokenWithRefreshToken = async (
  refreshToken: string
) => {
  const verifiedRefreshToken = verifyToken(
    refreshToken,
    envVars.JWT_REFRESH_SECRET
  ) as JwtPayload;

  const isUserExist = await User.findOne({ email: verifiedRefreshToken.email });

  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User not exists");
  }

  if (
    isUserExist.status === Status.BLOCKED ||
    isUserExist.status === Status.DELETED ||
    isUserExist.status === Status.PENDING
  ) {
    throw new AppError(httpStatus.BAD_REQUEST, `User is ${isUserExist.status}`);
  }

  const jwtPayload = {
    userId: isUserExist._id,
    phoneNumber: isUserExist.phoneNumber,
    role: isUserExist.role,
  };

  const accessToken = generateToken(
    jwtPayload,
    envVars.JWT_SECRET,
    envVars.JWT_EXPIRES_IN
  );

  return accessToken;
};
