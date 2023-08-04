import z from "zod";

export const env = z
  .object({
    JWT_SECRET: z.string(),
  })
  .parse(process.env);
