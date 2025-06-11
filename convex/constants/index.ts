import { IssueStatusTypes, TaskPriorityType } from "../schema";

export const DEFAULT_PROJECT_TASK_STATUS_NAME = [
  "TODO",
  "DONE",
  "IN_REVIEW",
  "BACKLOG",
  "IN_PROGRESS",
  "CANCELLED",
  "SUSPENDED",
];

// export const PRIORITY

export const EDIT_TASK_POSITION_ON_SERVER_SIGNAL = -1;

export type TaskType =
  | (typeof DEFAULT_PROJECT_TASK_STATUS_NAME)[number]
  | string;

// const taskValue: TaskType = "";

export const TaskPriorityMapper = {
  0: "No priority",
  1: "Low",
  2: "Medium",
  3: "High",
  4: "Urgent",
} as const;
// export const TaskPriorityIconMapper = {
//   0: ,
//   1: "Low",
//   2: "Medium",
//   3: "High",
//   4: "Urgent",
// } as const;

export const TaskPriority = Object.keys(TaskPriorityMapper).map((priority) =>
  Number(priority)
) as unknown as TaskPriorityType[];

export type PriorityTypes =
  (typeof TaskPriorityMapper)[keyof typeof TaskPriorityMapper];

export const DefaultPriority = 0;

// Max Limit on extra Project Status for free users
export const FREE_MAX_TASK_STATUS = 3;

export const DEFAULT_PROJECT_TASK_STATUS: IssueStatusTypes[] = [
  {
    issueName: DEFAULT_PROJECT_TASK_STATUS_NAME[0],
    issuePosition: 1,
  },
  {
    issueName: DEFAULT_PROJECT_TASK_STATUS_NAME[1],
    issuePosition: 2,
  },
  {
    issueName: DEFAULT_PROJECT_TASK_STATUS_NAME[2],
    issuePosition: 3,
  },
  {
    issueName: DEFAULT_PROJECT_TASK_STATUS_NAME[3],
    issuePosition: 4,
  },
  {
    issueName: DEFAULT_PROJECT_TASK_STATUS_NAME[4],
    issuePosition: 5,
  },
  {
    issueName: DEFAULT_PROJECT_TASK_STATUS_NAME[5],
    issuePosition: 6,
  },
];

export const NUMBER_OF_DEFAULT_TASK_STATUS = DEFAULT_PROJECT_TASK_STATUS.length;
