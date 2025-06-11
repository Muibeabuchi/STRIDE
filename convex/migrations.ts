import { Migrations } from "@convex-dev/migrations";
import { components, internal } from "./_generated/api.js";
import { DataModel } from "./_generated/dataModel.js";
import {
  DEFAULT_PROJECT_TASK_STATUS,
  DefaultPriority,
} from "./constants/index";

export const migrations = new Migrations<DataModel>(components.migrations);

export const addNewTaskStatus = migrations.define({
  table: "projects",
  async migrateOne(ctx, doc) {
    await ctx.db.patch(doc._id, {
      projectTaskStatus: DEFAULT_PROJECT_TASK_STATUS,
    });
    // }
  },
});

export const addDefaultPriority1 = migrations.define({
  table: "tasks",
  async migrateOne(ctx, doc) {
    if (!doc.priority) {
      await ctx.db.patch(doc._id, {
        priority: DefaultPriority,
      });
    }
  },
});

// export const addDefaultTask

export const run = migrations.runner(internal.migrations.addNewTaskStatus);
export const runAddTaskPriority = migrations.runner(
  internal.migrations.addDefaultPriority1
);
