import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1, "Required"),
});
export const signupSchema = z.object({
  name: z.string().trim().min(4, "Required"),
  email: z.string().trim().email(),
  password: z.string().min(8, "Password length must be a minimum of 8"),
});
