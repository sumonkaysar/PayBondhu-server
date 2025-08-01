import { Router } from "express";
import checkAuth from "../../middlewares/checkAuth";
import validateRequest from "../../middlewares/validateRequest";
import { UserControllers } from "./user.controller";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";

const router = Router();

router.post(
  "/register",
  validateRequest(createUserZodSchema),
  UserControllers.createUser
);

router.get("/all-users", UserControllers.getAllUsers);

router.patch(
  "/:id",
  checkAuth(),
  validateRequest(updateUserZodSchema),
  UserControllers.updateUser
);

export const UserRoutes = router;
