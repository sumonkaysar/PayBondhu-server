import z from "zod";
import { Role, Status } from "./user.interface";

export const createUserZodSchema = z.object({
  name: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Name is required"
          : "Name must be a string",
    })
    .nonempty({ error: "Name can't be blank" })
    .min(2, { error: "Name must be at least 2 characters long." })
    .max(50, { error: "Name can't be more than 50 characters." }),
  phoneNumber: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Phone number is required"
          : "Phone number must be a string",
    })
    .nonempty({ error: "Phone number can't be blank" })
    .regex(/^(\+8801[3-9]\d{8}|01[3-9]\d{8})$/, {
      error:
        "Invalid format for Bangladeshi phone number (+8801xxxxxxxxx or 01xxxxxxxxx)",
    }),
  password: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Password is required"
          : "Password must be a string",
    })
    .nonempty({ error: "Password can't be blank" })
    .min(5, { error: "Password must be at least 5 digits" })
    .regex(/^\d{5,}$/, {
      error: "Password must be digits only",
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

export const updateUserNameZodSchema = z.object({
  name: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Name is required"
          : "Name must be a string",
    })
    .nonempty({ error: "Name can't be blank" })
    .min(2, { error: "Name must be at least 2 characters long." })
    .max(50, { error: "Name can't be more than 50 characters." })
    .optional(),
});

export const updateUserStatusZodSchema = z.object({
  status: z
    .enum(Status, {
      error: `Status must be one of: ${Object.values(Status).join(", ")}`,
    })
    .optional()
    .default(Status.ACTIVE),
});
