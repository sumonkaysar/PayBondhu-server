import z from "zod";

const getTransactionZodSchema = (isAgent = false) =>
  z.object({
    receiver: z
      .string({
        error: (issue) =>
          issue.input === undefined
            ? `${isAgent ? "Agent" : "Reciever"} phone number is required`
            : `${isAgent ? "Agent" : "Reciever"} phone number must be string`,
      })
      .regex(/^(\+8801[3-9]\d{8}|01[3-9]\d{8})$/, {
        error:
          "Invalid format for Bangladeshi phone number (+8801xxxxxxxxx or 01xxxxxxxxx)",
      }),
    amount: z
      .number({
        error: (issue) =>
          issue.input === undefined
            ? "Amount is required"
            : "Amount must be a number",
      })
      .positive({ error: "Amount must be a positive number" }),
    //   .min(min, { message: `Amount must be at least ${min}` })
    //   .max(max, { message: `Amount can't be more than ${max}` }),
  });

export const sendMoneyZodSchema = getTransactionZodSchema();

export const cashInZodSchema = getTransactionZodSchema();

export const cashOutZodSchema = getTransactionZodSchema(true);
