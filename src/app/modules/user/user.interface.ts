/* eslint-disable no-unused-vars */
import { Types } from "mongoose";

export enum Role {
  // SUPER_ADMIN="SUPER_ADMIN",
  ADMIN = "ADMIN",
  AGENT = "AGENT",
  USER = "USER",
}

export enum Status {
  PENDING = "PENDING",
  ACTIVE = "ACTIVE",
  BLOCKED = "BLOCKED",
  DELETED = "DELETED",
}

export interface IUser {
  _id?: string;
  name: string;
  phoneNumber: string;
  password: string;
  role: Role;
  status: Status;
  wallet?: Types.ObjectId;
}
