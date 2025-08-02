import { Router } from "express";
import checkAuth from "../../middlewares/checkAuth";
import validateRequest from "../../middlewares/validateRequest";
import { Role } from "../user/user.interface";
import { TransactionControllers } from "./transaction.controller";
import {
  addOrWithdrawMoneyZodSchema,
  cashInZodSchema,
  cashOutZodSchema,
  sendMoneyZodSchema,
} from "./transaction.validation";

const router = Router();

router.post(
  "/add-money",
  checkAuth(Role.USER, Role.AGENT),
  validateRequest(addOrWithdrawMoneyZodSchema),
  TransactionControllers.addMoney
);

router.post(
  "/withdraw",
  checkAuth(Role.USER),
  validateRequest(addOrWithdrawMoneyZodSchema),
  TransactionControllers.withdrawMoney
);

router.post(
  "/send-money",
  checkAuth(Role.USER),
  validateRequest(sendMoneyZodSchema),
  TransactionControllers.sendMoney
);

router.post(
  "/cash-in",
  checkAuth(Role.AGENT),
  validateRequest(cashInZodSchema),
  TransactionControllers.cashIn
);

router.post(
  "/cash-out",
  checkAuth(Role.USER),
  validateRequest(cashOutZodSchema),
  TransactionControllers.cashOut
);

router.get(
  "/me",
  checkAuth(Role.USER, Role.AGENT),
  TransactionControllers.myTransactions
);

router.get(
  "/all-transactions",
  checkAuth(Role.ADMIN),
  TransactionControllers.getAllTransactions
);

router.get(
  "/:id/reverse",
  checkAuth(Role.ADMIN),
  TransactionControllers.reverseTransaction
);

export const TransactionRoutes = router;
