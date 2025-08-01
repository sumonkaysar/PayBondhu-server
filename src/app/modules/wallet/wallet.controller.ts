import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import httpStatus from "../../utils/httpStatus";
import sendResponse from "../../utils/sendResponse";
import { WalletServices } from "./wallet.service";

const getAllWallets = catchAsync(async (req: Request, res: Response) => {
  const result = await WalletServices.getAllWallets();

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "All wallets retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getMyWallet = catchAsync(async (req: Request, res: Response) => {
  const result = await WalletServices.getMyWallet(req.user.userId);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "My wallet retrieved successfully",
    data: result,
  });
});

const updateWallet = catchAsync(async (req: Request, res: Response) => {
  const { id: walletId } = req.params;
  const result = await WalletServices.updateWallet(walletId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Wallet updated successfully",
    data: result,
  });
});

export const WalletControllers = {
  getAllWallets,
  getMyWallet,
  updateWallet,
};
