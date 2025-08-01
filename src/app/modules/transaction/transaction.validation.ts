import z from "zod";

const getAmountZodSchema = () =>
  z
    .number({
      error: (issue) =>
        issue.input === undefined
          ? "Amount is required"
          : "Amount must be a number",
    })
    .positive({ error: "Amount must be a positive number" });

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
    amount: getAmountZodSchema(),
  });

export const sendMoneyZodSchema = getTransactionZodSchema();

export const cashInZodSchema = getTransactionZodSchema();

export const cashOutZodSchema = getTransactionZodSchema(true);

export const addOrWithdrawMoneyZodSchema = z.object({
  through: z.string({
    error: (issue) =>
      issue.input === undefined
        ? "Through is required"
        : "Through must be string",
  }),
  amount: getAmountZodSchema(),
});
