import mongoose from "mongoose";
import { TGenericErrorResponse } from "../interfaces/error.types";
import httpStatus from "../utils/httpStatus";

const handleCastError = (
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  _err: mongoose.Error.CastError
): TGenericErrorResponse => {
  return {
    statusCode: httpStatus.BAD_REQUEST,
    message: "Invalid MongoDB ObjectId",
  };
};

export default handleCastError;
