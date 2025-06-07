import { z } from "zod";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { DottedSeparator } from "@/components/doted-separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormLabel,
  FormItem,
  FormField,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";

import { createTaskSchema } from "../schema";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useMatchRoute, useNavigate } from "@tanstack/react-router";
import { useCreateTask } from "../api/use-create-task";
import { Id } from "convex/_generated/dataModel";
import DatePicker from "@/components/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { useTaskModalStore } from "@/store/store";
import { useProjectId } from "@/features/projects/hooks/use-project-id";
import { IssueStatusTypes } from "convex/schema";
import { truncateString } from "@/utils/truncate-words";

interface CreateTaskFormProps {
  onCancel?: () => void;
  projectOptions: {
    id: Id<"projects">;
    name: string;
    imageUrl: string;
  }[];
  memberOptions: {
    id: Id<"users">;
    name: string | undefined;
  }[];
  projectTaskStatus: IssueStatusTypes[] | null;
}

export const CreateTaskForm = ({
  onCancel,
  memberOptions,
  projectOptions,
  projectTaskStatus,
}: CreateTaskFormProps) => {
  const navigate = useNavigate();
  const workspaceId = useWorkspaceId();
  const matchRoute = useMatchRoute();
  const isTaskPage = matchRoute({
    to: "/workspaces/$workspaceId/tasks",
    params: {
      workspaceId: workspaceId,
    },
  });
  const isHomePage = matchRoute({
    to: "/workspaces/$workspaceId",
    params: {
      workspaceId: workspaceId,
    },
  });

  // pass true if the route is /workspaces/$workspaceId/tasks
  const projectId = useProjectId(!!isTaskPage || !!isHomePage);

  const { taskStatus } = useTaskModalStore();
  const { mutate: createTask, isPending: isCreatingTask } = useCreateTask();
  const form = useForm<z.infer<typeof createTaskSchema>>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      taskName: "",
      status:
        taskStatus === "ALL" || taskStatus === null ? undefined : taskStatus,
      projectId: projectId ?? undefined,
    },
  });

  const ProjectIdOption = projectOptions.find(
    (project) => project.id === projectId
  );

  const ProjectOptionsToRender = ProjectIdOption
    ? [ProjectIdOption]
    : projectOptions;

  const onSubmit = async (values: z.infer<typeof createTaskSchema>) => {
    return createTask(
      {
        workspaceId,
        status: values.status,
        taskName: values.taskName,
        // ? INSPECT THIS DATE METHOD
        dueDate: values.dueDate.toISOString(),
        assigneeId: values.assigneeId as Id<"users">,
        projectId: values.projectId as Id<"projects">,
      },
      {
        onSuccess(taskId) {
          onCancel?.();
          // form.reset();
          setTimeout(() => {
            navigate({
              to: "/workspaces/$workspaceId/tasks/$taskId",
              params: {
                workspaceId,
                taskId,
              },
              // search: (search) => {
              //   return {
              //     ...search,
              //     status: values.status,
              //     assigneeId: values.assigneeId,
              //     projectId: values.projectId,
              //     dueDate: values.dueDate,
              //   };
              // },
            });
          }, 1000);
        },
      }
    );
  };

  return (
    <Card className="w-full h-full border-none shadow-none gap-4">
      <CardHeader className="flex p-2 px-4">
        <CardTitle className="text-lg font-bold">Create a new Task</CardTitle>
      </CardHeader>

      <CardContent className="p-4 -my-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-y-4">
              <FormField
                control={form.control}
                name="taskName"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Task Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Task Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Due Date</FormLabel>
                      <FormControl>
                        <DatePicker
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="assigneeId"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Assignee</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Assignee" />
                          </SelectTrigger>
                        </FormControl>
                        <FormMessage />
                        <SelectContent>
                          {memberOptions.map((member) => (
                            <SelectItem key={member.id} value={member.id}>
                              <div className="flex items-center gap-x-2">
                                <MemberAvatar
                                  name={member?.name ?? ""}
                                  className="size-6"
                                />
                                {member.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              {projectTaskStatus && (
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Select Status</FormLabel>
                        <Select
                          defaultValue={
                            taskStatus === "ALL" || taskStatus === null
                              ? undefined
                              : taskStatus
                          }
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                          </FormControl>
                          <FormMessage />
                          <SelectContent>
                            {projectTaskStatus.map((task) => (
                              <SelectItem
                                value={task.issueName}
                                key={task.issueName}
                              >
                                {task.issueName.toLocaleUpperCase()}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              )}
              <FormField
                control={form.control}
                name="projectId"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Select Project</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        defaultValue={
                          projectId === null ? field.value : projectId
                        }
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Project" />
                          </SelectTrigger>
                        </FormControl>
                        <FormMessage />
                        <SelectContent>
                          {ProjectOptionsToRender.length > 0 ? (
                            ProjectOptionsToRender.map((project) => {
                              return (
                                <SelectItem key={project.id} value={project.id}>
                                  <div className="flex items-center gap-x-2">
                                    <ProjectAvatar
                                      name={project.name}
                                      className="size-6"
                                      image={project.imageUrl}
                                    />
                                    <p className="truncate">
                                      {truncateString(project.name, 3, 20)}
                                    </p>
                                  </div>
                                </SelectItem>
                              );
                            })
                          ) : (
                            <p className="text-sm bg-accent p-1 ">
                              No projects{" "}
                            </p>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
            <DottedSeparator className="py-7" />
            <div className="flex items-center justify-between">
              <Button
                type="button"
                size="lg"
                variant="secondary"
                onClick={onCancel}
                disabled={form.formState.isSubmitting}
                className={cn(!!onCancel ? "visible" : "invisible")}
              >
                Cancel
              </Button>
              <Button
                disabled={form.formState.isSubmitting || isCreatingTask}
                type="submit"
                size="lg"
              >
                Create Task
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
