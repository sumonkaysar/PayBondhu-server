import { Router } from "express";
import checkAuth from "../../middlewares/checkAuth";
import validateRequest from "../../middlewares/validateRequest";
import { UserControllers } from "./user.controller";
import { Role } from "./user.interface";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";

const router = Router();

router.post(
  "/register",
  validateRequest(createUserZodSchema),
  UserControllers.createUser
);

router.patch(
  "/:id",
  checkAuth(),
  validateRequest(updateUserZodSchema),
  UserControllers.updateUser
);

router.get("/all-users", checkAuth(Role.ADMIN), UserControllers.getAllUsers);

export const UserRoutes = router;
