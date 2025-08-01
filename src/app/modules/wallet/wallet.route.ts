import { Router } from "express";
import checkAuth from "../../middlewares/checkAuth";
import validateRequest from "../../middlewares/validateRequest";
import { Role } from "../user/user.interface";
import { WalletControllers } from "./wallet.controller";
import { updateWalletStatusZodSchema } from "./wallet.validation";

const router = Router();

router.get("/all", checkAuth(Role.ADMIN), WalletControllers.getAllWallets);

router.get(
  "/me",
  checkAuth(Role.USER, Role.AGENT),
  WalletControllers.getMyWallet
);

router.patch(
  "/",
  checkAuth(Role.ADMIN),
  validateRequest(updateWalletStatusZodSchema),
  WalletControllers.updateWallet
);

export const WalletRoutes = router;
