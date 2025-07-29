import mongoose from "mongoose";
import {
  TErrorSources,
  TGenericErrorResponse,
} from "../interfaces/error.types";
import httpStatus from "../utils/httpStatus";

const handleValidationError = (
  err: mongoose.Error.ValidationError
): TGenericErrorResponse => {
  const errorSources = (Object.values(err.errors) as TErrorSources[]).map(
    ({ path, message }) => ({
      path,
      message,
    })
  );

  return {
    statusCode: httpStatus.BAD_REQUEST,
    message: "Validation error occured",
    errorSources,
  };
};

export default handleValidationError;
