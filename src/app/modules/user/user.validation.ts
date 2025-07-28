import z from "zod";
import { Role, Status } from "./user.interface";

export const createUserZodSchema = z.object({
  name: z
    .string({ error: "Name is required" })
    .nonempty({ message: "Name is required." })
    .min(2, { message: "Name must be at least 2 characters long." })
    .max(50, { message: "Name can't be more than 50 characters." }),
  phoneNumber: z
    .string({ error: "Phone is required" })
    .regex(/^(\+8801[3-9]\d{8}|01[3-9]\d{8})$/, {
      message:
        "Invalid format for Bangladeshi phone number (+8801xxxxxxxxx or 01xxxxxxxxx)",
    }),
  password: z
    .string({ error: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/, {
      message:
        "Password must include at least 1 uppercase, 1 lowercase, and 1 special character",
    }),
  role: z
    .enum(Role, {
      error: `Role must be one of: ${Object.values(Role).join(", ")}`,
    })
    .optional()
    .default(Role.USER),
  status: z
    .enum(Status, {
      error: `Status must be one of: ${Object.values(Status).join(", ")}`,
    })
    .optional()
    .default(Status.ACTIVE),
});

export const updateUserZodSchema = z.object({
  name: z
    .string({ error: "Name is required" })
    .nonempty({ message: "Name is required." })
    .min(2, { message: "Name must be at least 2 characters long." })
    .max(50, { message: "Name can't be more than 50 characters." })
    .optional(),
  password: z
    .string({ error: "Password is required" })
    .min(6, { message: "Password must be at least 5 digits" })
    .regex(/^\d{5,}$/, {
      message: "Password must be digits only",
    }),
  role: z
    .enum(Role, {
      error: `Role must be one of: ${Object.values(Role).join(", ")}`,
    })
    .optional()
    .default(Role.USER),
  status: z
    .enum(Status, {
      error: `Status must be one of: ${Object.values(Status).join(", ")}`,
    })
    .optional()
    .default(Status.ACTIVE),
});
