import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import envVars from "../config/env.config";
import AppError from "../errorHelpers/AppError";
import { Role, Status } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import httpStatus from "../utils/httpStatus";
import { verifyToken } from "../utils/jwt";

const checkAuth = (...roles: Role[]) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const accessToken = req.cookies.accessToken || req.headers.authorization;

      if (!accessToken) {
        throw new AppError(httpStatus.UNAUTHORIZED, "You are unauthorized");
      }

      const decoded = verifyToken(
        accessToken,
        envVars.JWT_SECRET
      ) as JwtPayload;

      const isUserExist = await User.findById(decoded.userId);

      if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User does not exist");
      }

      // check agent for admin approval
      if (
        isUserExist.role === Role.AGENT &&
        isUserExist.status === Status.PENDING
      ) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          "Your account is pending, please wait for admin approval"
        );
      }

      if (
        isUserExist.status === Status.BLOCKED ||
        isUserExist.status === Status.DELETED
      ) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          `You are ${isUserExist.status}`
        );
      }

      if (roles.length > 0 && !roles.includes(isUserExist.role)) {
        throw new AppError(httpStatus.FORBIDDEN, "You are forbidden");
      }

      req.user = decoded;
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default checkAuth;
