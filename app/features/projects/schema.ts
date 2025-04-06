import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().trim().min(1, "Required"),
  image: z.instanceof(File).optional(),
  // workspaceId: z.string(),
});
export const updateProjectSchema = z.object({
  name: z.string().trim().min(1, "Must be 1 or more characters"),
  image: z.instanceof(File).or(z.string()),
  workspaceId: z.string(),
});
