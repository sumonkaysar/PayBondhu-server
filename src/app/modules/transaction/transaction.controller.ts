import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import httpStatus from "../../utils/httpStatus";
import sendResponse from "../../utils/sendResponse";
import { TransactionType } from "./transaction.interface";
import { TransactionServices } from "./transaction.service";

const addMoney = catchAsync(async (req: Request, res: Response) => {
  const result = await TransactionServices.addOrWithdrawMoney(
    req.user.userId,
    req.body,
    TransactionType.ADD_MONEY
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Add money performed successfully",
    data: result,
  });
});

const withdrawMoney = catchAsync(async (req: Request, res: Response) => {
  const result = await TransactionServices.addOrWithdrawMoney(
    req.user.userId,
    req.body,
    TransactionType.WITHDRAW
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Withdraw money performed successfully",
    data: result,
  });
});

const sendMoney = catchAsync(async (req: Request, res: Response) => {
  const result = await TransactionServices.makeTransaction(
    req.body,
    req.user,
    TransactionType.SEND_MONEY
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Send Money performed successfully",
    data: result,
  });
});

const cashIn = catchAsync(async (req: Request, res: Response) => {
  const result = await TransactionServices.makeTransaction(
    req.body,
    req.user,
    TransactionType.CASH_IN
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Cash In performed successfully",
    data: result,
  });
});

const cashOut = catchAsync(async (req: Request, res: Response) => {
  const result = await TransactionServices.makeTransaction(
    req.body,
    req.user,
    TransactionType.CASH_OUT
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Cash Out performed successfully",
    data: result,
  });
});

const getAllTransactions = catchAsync(async (req: Request, res: Response) => {
  const result = await TransactionServices.getAllTransactions(
    req.query as Record<string, string>
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All transactions retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const myTransactions = catchAsync(async (req: Request, res: Response) => {
  const result = await TransactionServices.myTransactions(req.user.userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "My transactions retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const reverseTransaction = catchAsync(async (req: Request, res: Response) => {
  const result = await TransactionServices.reverseTransaction(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Transaction reversed successfully",
    data: result,
  });
});

export const TransactionControllers = {
  addMoney,
  withdrawMoney,
  sendMoney,
  cashIn,
  cashOut,
  getAllTransactions,
  myTransactions,
  reverseTransaction,
};
