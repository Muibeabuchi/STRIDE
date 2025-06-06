import { IssueStatusTypes } from "../schema";

export const TaskPriorityMapper = {
  0: "No priority",
  1: "Low",
  2: "Medium",
  3: "High",
  4: "Urgent",
} as const;

export const DefaultPriority = 0;

// Max Limit on extra Project Status for free users
export const FREE_MAX_TASK_STATUS = 3;

export const DEFAULT_PROJECT_TASK_STATUS: IssueStatusTypes[] = [
  {
    issueName: "TODO",
    issuePosition: 1,
  },
  {
    issueName: "DONE",
    issuePosition: 2,
  },
  {
    issueName: "IN_REVIEW",
    issuePosition: 3,
  },
  {
    issueName: "BACKLOG",
    issuePosition: 4,
  },
  {
    issueName: "IN_PROGRESS",
    issuePosition: 5,
  },
];

export const DEFAULT_TASK_STATUS_NAMES = [
  "TODOS",
  "DONE",
  "IN_REVIEW",
  "BACKLOG",
  "IN_PROGRESS",
];

export const NUMBER_OF_DEFAULT_TASK_STATUS = DEFAULT_PROJECT_TASK_STATUS.length;
