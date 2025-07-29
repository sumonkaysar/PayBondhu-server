import { ZodError } from "zod";
import {
  TErrorSources,
  TGenericErrorResponse,
} from "../interfaces/error.types";
import httpStatus from "../utils/httpStatus";

const handleZodError = (err: ZodError): TGenericErrorResponse => {
  const errorSources = err.issues.map(({ path, message }) => ({
    path: path[path.length - 1],
    message,
  })) as TErrorSources[];

  return {
    statusCode: httpStatus.BAD_REQUEST,
    message: "Zod validation error",
    errorSources: errorSources,
  };
};

export default handleZodError;
