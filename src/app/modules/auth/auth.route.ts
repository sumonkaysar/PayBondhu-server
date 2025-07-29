import { Router } from "express";
import { AuthControllers } from "./auth.controller";

const router = Router();

router.post(
  "/login",
  //   validateRequest(createUserZodSchema),
  AuthControllers.credentialsLogin
);

export const AuthRoutes = router;
