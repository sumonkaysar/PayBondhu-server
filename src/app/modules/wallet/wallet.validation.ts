import z from "zod";

export const updateWalletStatusZodSchema = z.object({
  isBlocked: z.boolean({
    error: (issue) =>
      issue.input === undefined
        ? "isBlocked is required"
        : "isBlocked must be either true or false",
  }),
});
