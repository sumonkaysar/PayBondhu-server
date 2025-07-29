import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/AppError";
import { Role } from "../modules/user/user.interface";
import httpStatus from "../utils/httpStatus";

const checkAuth = (...roles: Role[]) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization;

      if (!accessToken) {
        throw new AppError(httpStatus.UNAUTHORIZED, "You are unauthorized");
      }

      if (
        isUserExist.role === Role.AGENT &&
        isUserExist.status === Status.PENDING
      ) {
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default checkAuth;
