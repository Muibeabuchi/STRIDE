import { Migrations } from "@convex-dev/migrations";
import { components, internal } from "./_generated/api.js";
import { DataModel } from "./_generated/dataModel.js";
import { DEFAULT_PROJECT_TASK_STATUS } from "./constants/index.js";

export const migrations = new Migrations<DataModel>(components.migrations);

// export const createNewTaskStatusField = migrations.define({
//   table: "projects",
//   async migrateOne(ctx, doc) {
//     // add default task status to all project document
//     // if (doc.taskStatus === undefined) {
//     console.log("running migration for", doc._id);
//     await ctx.db.patch(doc._id, {
//       taskStatus: DEFAULT_PROJECT_TASK_STATUS,
//     });
//     // }
//   },
// });

// export const removeOldProjectTaskStatus = migrations.define({
//   table: "projects",
//   async migrateOne(ctx, doc) {
//     if (doc.projectTaskStatus !== undefined) {
//       await ctx.db.patch(doc._id, {
//         projectTaskStatus: null,
//       });
//     }
//   },
// });

// export const deleteTaskStatusField = migrations.define({
//   table: "projects",
//   async migrateOne(ctx, doc) {
//     if (doc.taskStatus) {
//       await ctx.db.patch(doc._id, {
//         taskStatus: undefined,
//       });
//     }
//     // }
//   },
// });

// export const run = migrations.runner(internal.migrations.deleteTaskStatusField);
