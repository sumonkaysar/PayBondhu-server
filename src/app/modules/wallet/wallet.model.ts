import { model, Schema } from "mongoose";
import { IWallet } from "./wallet.interface";

const walletSchema = new Schema<IWallet>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    balance: {
      type: Number,
      default: 50,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const Wallet = model<IWallet>("Wallet", walletSchema);
