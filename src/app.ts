import cors from "cors";
import express, { Application, Request, Response } from "express";
import router from "./app/routes";
import httpStatus from "./app/utils/httpStatus";

const app: Application = express();

app.use(cors());
app.use(express.json());

app.use("api/v1", router);

app.get("/", (_req: Request, res: Response) => {
  res.status(httpStatus.OK).json({ message: "PayBondhu server is on: 😎" });
});

export default app;
