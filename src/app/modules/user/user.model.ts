import { hash } from "bcryptjs";
import { model, Schema } from "mongoose";
import envVars from "../../config/env.config";
import { IUser, Role, Status } from "./user.interface";

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.USER,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(Status),
      default: Status.ACTIVE,
      required: true,
    },
    wallet: {
      type: Schema.Types.ObjectId,
      ref: "Wallet",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await hash(
      this.password,
      Number(envVars.BCRYPTJS_SALT_ROUND)
    );
  }
  next();
});

userSchema.post("save", async function () {
  this.set("password", "", { strict: false });
});

export const User = model<IUser>("User", userSchema);
