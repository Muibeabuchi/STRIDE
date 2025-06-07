import { Migrations } from "@convex-dev/migrations";
import { components, internal } from "./_generated/api.js";
import { DataModel } from "./_generated/dataModel.js";
import { DEFAULT_PROJECT_TASK_STATUS } from "./constants/index.js";

export const migrations = new Migrations<DataModel>(components.migrations);

export const addNewTaskStatus = migrations.define({
  table: "projects",
  async migrateOne(ctx, doc) {
    console.log("running migration for", doc._id);
    await ctx.db.patch(doc._id, {
      projectTaskStatus: DEFAULT_PROJECT_TASK_STATUS,
    });
    // }
  },
});

export const run = migrations.runner(internal.migrations.addNewTaskStatus);
