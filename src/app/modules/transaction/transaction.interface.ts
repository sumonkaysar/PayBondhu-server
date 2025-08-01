/* eslint-disable no-unused-vars */
import { Types } from "mongoose";

export enum TransactionType {
  CASH_IN = "CASH_IN",
  CASH_OUT = "CASH_OUT",
  SEND_MONEY = "SEND_MONEY",
  ADD_MONEY = "ADD_MONEY",
  WITHDRAW = "WITHDRAW",
}

export enum TransactionStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  REVERSED = "REVERSED",
}

export interface ITransaction {
  _id?: Types.ObjectId;
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  type: TransactionType;
  amount: number;
  fee?: number;
  commission?: number;
  through?: string;
  status: TransactionStatus;
}
