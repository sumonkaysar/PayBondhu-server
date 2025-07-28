import { Request, Response } from "express";
import { UserServices } from "./user.service";

const createUser = (req: Request, res: Response) => {
  const result = UserServices.createUser(req.body);
  res.send(result);
};

export const UserControllers = {
  createUser,
};
