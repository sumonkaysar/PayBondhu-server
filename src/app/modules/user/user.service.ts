import { hash } from "bcryptjs";
import { startSession } from "mongoose";
import envVars from "../../config/env.config";
import AppError from "../../errorHelpers/AppError";
import FilterData from "../../utils/filterData";
import httpStatus from "../../utils/httpStatus";
import { Wallet } from "../wallet/wallet.model";
import { userSearchableFields } from "./user.const";
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
    throw new AppError(httpStatus.BAD_REQUEST, "You can't be Admin");
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

const getAllUsers = async (query: Record<string, string>) => {
  const fields =
    query.fields &&
    query.fields
      ?.split(",")
      .filter((field) => field !== "password")
      .join(",");

  const { data: FilteredUser, meta } = await FilterData(
    User,
    {
      ...query,
      fields,
    },
    userSearchableFields
  );

  let users = FilteredUser;

  if (
    !query.fields ||
    (!query.fields?.includes("-wallet") &&
      (query.fields?.includes("wallet") || query.fields?.includes("-")))
  ) {
    users = FilteredUser.populate("wallet", "balance isBlocked");
  }

  return {
    data: await users,
    meta,
  };
};

const updateUser = async (userId: string, payload: IUser) => {
  const isUserExist = await User.findById(userId);

  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User Not Found!");
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

const getMe = async (userId: string) => {
  const user = await User.findById(userId);
  return user;
};

export const UserServices = {
  createUser,
  getAllUsers,
  updateUser,
  getMe,
};
