import { Request, Response } from "express";
import httpStatus from "../utils/httpStatus";

const notFound = (_req: Request, res: Response) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "API Not Found!",
    err: null,
  });
};

export default notFound;
