import cors from "cors";
import express, { Application, Request, Response } from "express";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import router from "./app/routes";
import httpStatus from "./app/utils/httpStatus";

const app: Application = express();

app.use(cors());
app.use(express.json());

app.use("api/v1", router);

app.get("/", (_req: Request, res: Response) => {
  res.status(httpStatus.OK).json({
    message: "PayBondhu server is on: 😎",
  });
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
