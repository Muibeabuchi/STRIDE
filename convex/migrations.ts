import { Migrations } from "@convex-dev/migrations";
import { components, internal } from "./_generated/api.js";
import { DataModel } from "./_generated/dataModel.js";
import { DEFAULT_PROJECT_TASK_STATUS } from "./constants/index.js";

export const migrations = new Migrations<DataModel>(components.migrations);

// TODO: RUN THIS DB MIGRATION AGAIN
export const createNewTaskStatusField = migrations.define({
  table: "projects",
  async migrateOne(ctx, doc) {
    // add default task status to all project document
    // if (doc.taskStatus === undefined) {
    console.log("running migration for", doc._id);
    await ctx.db.patch(doc._id, {
      taskStatus: DEFAULT_PROJECT_TASK_STATUS,
    });
    // }
  },
});

export const run = migrations.runner(
  internal.migrations.createNewTaskStatusField
);
