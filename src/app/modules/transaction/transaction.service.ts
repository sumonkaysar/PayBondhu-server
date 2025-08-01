import { JwtPayload } from "jsonwebtoken";
import { Document, startSession } from "mongoose";
import AppError from "../../errorHelpers/AppError";
import FilterData from "../../utils/filterData";
import httpStatus from "../../utils/httpStatus";
import { Role, Status } from "../user/user.interface";
import { User } from "../user/user.model";
import { IWallet } from "../wallet/wallet.interface";
import { Wallet } from "../wallet/wallet.model";
import { TransactionCommissions, TransactionFees } from "./transaction.const";
import { TransactionStatus, TransactionType } from "./transaction.interface";
import { Transaction } from "./transaction.model";

const getAllTransactions = async (query: Record<string, string>) => {
  const { data: FilteredTransaction, meta } = await FilterData(
    Transaction,
    query
  );

  let transactions = FilteredTransaction;

  if (query.fields) {
    if (
      !query.fields?.includes("-receiver") &&
      (query.fields?.includes("receiver") || query.fields?.includes("-"))
    ) {
      transactions = FilteredTransaction.populate(
        "receiver",
        "name phoneNumber role"
      );
    }
    if (
      !query.fields?.includes("-sender") &&
      (query.fields?.includes("sender") || query.fields?.includes("-"))
    ) {
      transactions = FilteredTransaction.populate(
        "sender",
        "name phoneNumber role"
      );
    }
  } else {
    transactions = FilteredTransaction.populate(
      "sender",
      "name phoneNumber role"
    ).populate("receiver", "name phoneNumber role");
  }

  return {
    data: await transactions,
    meta,
  };
};

const myTransactions = async (userId: string) => {
  const transactions = await Transaction.find({
    $or: [{ sender: userId }, { receiver: userId }],
  })
    .populate("sender", "name phoneNumber role")
    .populate("receiver", "name phoneNumber role");
  const totalTransactions = await Transaction.countDocuments();

  return {
    data: transactions,
    meta: {
      total: totalTransactions,
    },
  };
};

const addOrWithdrawMoney = async (
  userId: string,
  payload: { amount: number; through: string },
  type: TransactionType
) => {
  const session = await startSession();

  const isUserExist = await User.findById(userId);
  const userWallet = await Wallet.findById(isUserExist?.wallet);

  if (!userWallet) {
    throw new AppError(httpStatus.NOT_FOUND, "Your wallet not found!");
  }

  if (userWallet.isBlocked) {
    throw new AppError(httpStatus.BAD_REQUEST, "Your wallet is blocked");
  }

  const fee = Number(
    ((payload.amount * TransactionFees[type]) / 100).toFixed(2)
  );

  if (
    type === TransactionType.WITHDRAW &&
    payload.amount + fee > userWallet.balance
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Your wallet has insufficient balance"
    );
  }

  try {
    session.startTransaction();

    const transactionPayload = {
      sender: userId,
      receiver: userId,
      type,
      amount: payload.amount,
      fee,
      commission: TransactionCommissions[type],
      through: payload.through,
      status: TransactionStatus.COMPLETED,
    };

    const transaction = await Transaction.create([transactionPayload], {
      session,
    });

    switch (type) {
      case TransactionType.ADD_MONEY:
        userWallet.balance += payload.amount - fee;
        break;
      case TransactionType.WITHDRAW:
        userWallet.balance -= payload.amount + fee;
        break;
    }

    await userWallet.save({ session });
    await session.commitTransaction();

    return {
      transaction: transaction[0],
      senderBalance: userWallet.balance,
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const makeTransaction = async (
  payload: { receiver: string; amount: number },
  decoded: JwtPayload,
  type: TransactionType
) => {
  const session = await startSession();

  if (
    (type === TransactionType.SEND_MONEY ||
      type === TransactionType.CASH_OUT) &&
    decoded.role === Role.AGENT
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Agent can not do ${
        type === TransactionType.CASH_OUT ? "Cash Out" : "Send Money"
      }`
    );
  }

  if (type === TransactionType.CASH_IN && decoded.role !== Role.AGENT) {
    throw new AppError(httpStatus.BAD_REQUEST, "Only Agent can do Cash In");
  }

  const isReceiverExist = await User.findOne({ phoneNumber: payload.receiver });

  if (!isReceiverExist) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `${
        type === TransactionType.CASH_OUT ? "Agent" : "Receiver"
      } number does not exist`
    );
  }

  if (
    (type === TransactionType.CASH_IN || type === TransactionType.SEND_MONEY) &&
    isReceiverExist.role === Role.AGENT
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Performing ${
        type === TransactionType.SEND_MONEY ? "Send Money" : "Cash In"
      } to Agent not allowed`
    );
  }

  if (isReceiverExist.status !== Status.ACTIVE) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `${isReceiverExist.role === Role.AGENT ? "Agent" : "Receiver"} is ${
        isReceiverExist.status
      }`
    );
  }

  const receiverWallet = await Wallet.findById(isReceiverExist.wallet);

  if (!receiverWallet) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `${
        isReceiverExist.role === Role.AGENT ? "Agent" : "Receiver"
      } wallet not found`
    );
  }

  if (receiverWallet?.isBlocked) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `${
        isReceiverExist.role === Role.AGENT ? "Agent" : "Receiver"
      } wallet is blocked`
    );
  }

  const senderWallet = (await Wallet.findOne({
    user: decoded.userId,
  })) as IWallet & Document;

  if (senderWallet.isBlocked) {
    throw new AppError(httpStatus.BAD_REQUEST, "Your wallet is blocked");
  }

  // SEND MONEY: 5 tk fee if amount > 100 otherwise 0
  let fee = payload.amount > 100 ? TransactionFees.SEND_MONEY : 0;

  if (type !== TransactionType.SEND_MONEY) {
    fee = Number(((payload.amount * TransactionFees[type]) / 100).toFixed(2));
  }

  const commission = Number(
    ((payload.amount * TransactionCommissions[type]) / 100).toFixed(2)
  );

  if (payload.amount + fee > senderWallet.balance) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Your wallet has insufficient balance"
    );
  }

  try {
    session.startTransaction();

    const transactionPayload = {
      sender: decoded.userId,
      receiver: isReceiverExist._id,
      type,
      amount: payload.amount,
      fee,
      commission,
      status: TransactionStatus.COMPLETED,
    };

    const transaction = await Transaction.create([transactionPayload], {
      session,
    });

    switch (type) {
      case TransactionType.SEND_MONEY:
      case TransactionType.CASH_OUT:
        senderWallet.balance -= payload.amount + fee;
        receiverWallet.balance += payload.amount + commission;
        break;
      case TransactionType.CASH_IN:
        senderWallet.balance -= payload.amount - commission;
        receiverWallet.balance += payload.amount - fee;
        break;
    }

    await receiverWallet.save({ session });
    await senderWallet.save({ session });

    await session.commitTransaction();

    return {
      transaction: transaction[0],
      senderBalance: senderWallet.balance,
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const reverseTransaction = async (transactionId: string) => {
  const session = await startSession();
  const isTransactionExist = await Transaction.findById(transactionId);

  if (!isTransactionExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Transaction not found!");
  }

  const senderWallet = (await Wallet.findOne({
    user: isTransactionExist.sender,
  })) as IWallet & Document;

  const receiverWallet = (await Wallet.findOne({
    user: isTransactionExist.receiver,
  })) as IWallet & Document;

  switch (isTransactionExist.type) {
    case TransactionType.ADD_MONEY:
      // sender and receiver is same for add money
      senderWallet.balance -=
        isTransactionExist.amount - isTransactionExist.fee;
      break;
    case TransactionType.WITHDRAW:
      // sender and receiver is same for withdraw money
      senderWallet.balance +=
        isTransactionExist.amount + isTransactionExist.fee;
      break;
    case TransactionType.SEND_MONEY:
    case TransactionType.CASH_OUT:
      senderWallet.balance +=
        isTransactionExist.amount + isTransactionExist.fee;
      receiverWallet.balance -=
        isTransactionExist.amount + isTransactionExist.commission;
      break;
    case TransactionType.CASH_IN:
      senderWallet.balance +=
        isTransactionExist.amount - isTransactionExist.commission;
      receiverWallet.balance -=
        isTransactionExist.amount - isTransactionExist.fee;
      break;
  }

  try {
    session.startTransaction();

    await senderWallet.save({ session });

    switch (isTransactionExist.type) {
      case TransactionType.SEND_MONEY:
      case TransactionType.CASH_IN:
      case TransactionType.CASH_OUT:
        await receiverWallet.save({ session });
        break;
    }

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      transactionId,
      { status: TransactionStatus.REVERSED },
      { new: true, runValidators: true, session }
    );

    return updatedTransaction;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const TransactionServices = {
  getAllTransactions,
  myTransactions,
  addOrWithdrawMoney,
  makeTransaction,
  reverseTransaction,
};
