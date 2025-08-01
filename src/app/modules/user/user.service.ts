import { hash } from "bcryptjs";
import { JwtPayload } from "jsonwebtoken";
import { startSession } from "mongoose";
import envVars from "../../config/env.config";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "../../utils/httpStatus";
import { Wallet } from "../wallet/wallet.model";
import { IUser, Role, Status } from "./user.interface";
import { User } from "./user.model";

const createUser = async (payload: IUser) => {
  const session = await startSession();
  const isUserExist = await User.findOne({ phoneNumber: payload.phoneNumber });

  if (isUserExist) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Phone number already registered"
    );
  }

  if (payload.role === Role.ADMIN) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "A new Admin can't be registered"
    );
  }

  if (payload.role === Role.AGENT) {
    payload.status = Status.PENDING;
  }

  try {
    session.startTransaction();

    const user = await User.create([payload], { session });

    if (!user || !user[0]?._id) {
      throw new Error("Failed to create user");
    }

    const wallet = await Wallet.create(
      [
        {
          user: user[0]._id,
          balance: 50,
        },
      ],
      { session }
    );

    const updatedUser = await User.findByIdAndUpdate(
      user[0]._id,
      { wallet: wallet[0]._id },
      { new: true, runValidators: true, session }
    );

    await session.commitTransaction();
    return updatedUser;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const getAllUsers = async () => {
  const users = await User.find();
  const total = await User.countDocuments();

  return {
    data: users,
    meta: {
      total,
    },
  };
};

const updateUser = async (
  userId: string,
  payload: IUser,
  decoded: JwtPayload
) => {
  const isUserExist = await User.findById(userId);

  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User Not Found!");
  }

  if (
    payload.status &&
    (decoded.role === Role.AGENT || decoded.role === Role.USER)
  ) {
    throw new AppError(httpStatus.BAD_REQUEST, "You are not authorized");
  }

  if (payload.password) {
    payload.password = await hash(
      payload.password as string,
      Number(envVars.BCRYPTJS_SALT_ROUND)
    );
  }

  const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });

  return newUpdatedUser;
};

export const UserServices = {
  createUser,
  getAllUsers,
  updateUser,
};
