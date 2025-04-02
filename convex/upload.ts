import { authenticatedUserMutation } from "./middleware";

// ! UPLOAD FILE GENERATION
export const generateUploadUrl = authenticatedUserMutation({
  args: {},
  async handler(ctx) {
    return await ctx.storage.generateUploadUrl();
  },
});
