import { TGenericErrorResponse } from "../interfaces/error.types";
import httpStatus from "../utils/httpStatus";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleDuplicateError = (err: any): TGenericErrorResponse => {
  const match = err.message.match(/"([^"]*)"/);
  const message = `${match && match[1]} already exists`;
  return {
    statusCode: httpStatus.BAD_REQUEST,
    message,
  };
};

export default handleDuplicateError;
