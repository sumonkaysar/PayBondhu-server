import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, Request, Response } from "express";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import router from "./app/routes";
import httpStatus from "./app/utils/httpStatus";

const app: Application = express();

app.set("trust proxy", 1);
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

app.use("/api/v1", router);

app.get("/", (_req: Request, res: Response) => {
  res.status(httpStatus.OK).json({
    message: "PayBondhu server is on: 😎",
  });
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
