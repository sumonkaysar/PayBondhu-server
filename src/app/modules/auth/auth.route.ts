import { Router } from "express";
import checkAuth from "../../middlewares/checkAuth";
import { AuthControllers } from "./auth.controller";

const router = Router();

router.post("/login", AuthControllers.credentialsLogin);

router.get("/logout", AuthControllers.logout);

router.patch("/reset-password", checkAuth(), AuthControllers.resetPassword);

router.get("/refresh-token", AuthControllers.getNewAccessToken);

export const AuthRoutes = router;
