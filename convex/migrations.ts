import { Migrations } from "@convex-dev/migrations";
import { components, internal } from "./_generated/api.js";
import { DataModel } from "./_generated/dataModel.js";

export const migrations = new Migrations<DataModel>(components.migrations);

export const addTaskStatusToProjectTable = migrations.define({
  table: "projects",
  async migrateOne(ctx, doc) {
    // add default task status to all project document
    if (!doc.projectTaskStatus) {
      await ctx.db.patch(doc._id, {
        projectTaskStatus: [
          "TODO",
          "DONE",
          "IN_REVIEW",
          "BACKLOG",
          "IN_PROGRESS",
        ],
      });
    }
  },
});

export const run = migrations.runner(
  internal.migrations.addTaskStatusToProjectTable
);
