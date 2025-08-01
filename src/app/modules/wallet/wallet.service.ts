import AppError from "../../errorHelpers/AppError";
import FilterData from "../../utils/filterData";
import httpStatus from "../../utils/httpStatus";
import { User } from "../user/user.model";
import { IWallet } from "./wallet.interface";
import { Wallet } from "./wallet.model";

const getAllWallets = async (query: Record<string, string>) => {
  const { data: FilteredWallet, meta } = await FilterData(Wallet, query);

  let wallets = FilteredWallet;

  if (
    !query.fields ||
    (!query.fields?.includes("-user") &&
      (query.fields?.includes("user") || query.fields?.includes("-")))
  ) {
    wallets = FilteredWallet.populate("user", "name phoneNumber role");
  }

  return {
    data: await wallets,
    meta,
  };
};

const getMyWallet = async (userId: string) => {
  const wallet = await Wallet.findOne({ user: userId });

  if (!wallet) {
    throw new AppError(httpStatus.BAD_REQUEST, "Wallet not found");
  }

  if (wallet.isBlocked) {
    throw new AppError(httpStatus.BAD_REQUEST, "Wallet is blocked");
  }

  return wallet;
};

const updateWalletBlockStatus = async (walletId: string, payload: IWallet) => {
  const isWalletExist = await Wallet.findById(walletId);

  if (!isWalletExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Wallet not found");
  }

  const newUpdatedWallet = await User.findByIdAndUpdate(walletId, payload, {
    new: true,
    runValidators: true,
  });

  return newUpdatedWallet;
};

export const WalletServices = {
  getAllWallets,
  getMyWallet,
  updateWalletBlockStatus,
};
