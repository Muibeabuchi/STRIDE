import { z } from "zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

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
import { useNavigate } from "@tanstack/react-router";
import { useCreateTask } from "../api/use-create-task";
import { useProjectId } from "@/features/projects/hooks/use-project-id";
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
import { useEditTask } from "../api/use-edit-task";
import { getTaskByIdResponse } from "convex/schema";
import { useState } from "react";
import { truncateString } from "@/utils/truncate-words";

interface EditTaskFormProps {
  onCancel?: () => void;
  taskId: Id<"tasks">;
  projectOptions: {
    id: Id<"projects">;
    name: string;
    imageUrl: string;
  }[];
  memberOptions: {
    id: Id<"users">;
    name: string | undefined;
  }[];
  initialValues: getTaskByIdResponse;
  projectTaskStatus: string[] | null;
}

export const EditTaskForm = ({
  onCancel,
  memberOptions,
  projectOptions,
  taskId,
  initialValues,
  projectTaskStatus,
}: EditTaskFormProps) => {
  const navigate = useNavigate();
  const workspaceId = useWorkspaceId();
  const [isEditingTask, setEditingTask] = useState(false);
  const editTask = useEditTask();
  const form = useForm<z.infer<typeof createTaskSchema>>({
    resolver: zodResolver(createTaskSchema.omit({ description: true })),
    defaultValues: {
      assigneeId: initialValues.assigneeId,
      dueDate: new Date(initialValues.dueDate),
      projectId: initialValues.projectId,
      //! Watch out for this typescript assertion
      status: initialValues.status,
      taskName: initialValues.taskName,
    },
  });

  const onSubmit = async (values: z.infer<typeof createTaskSchema>) => {
    try {
      setEditingTask(true);
      await editTask({
        workspaceId,
        taskId,
        taskStatus: values.status,
        taskName: values.taskName,
        taskDescription: values.description,
        // ? INSPECT THIS DATE METHOD
        dueDate: values.dueDate.toISOString(),
        assigneeId: values.assigneeId as Id<"users">,
        projectId: values.projectId as Id<"projects">,
      });
      form.reset();
      onCancel?.();
    } catch (error) {
      toast.error("Failed to edit the  task");
      console.error("Failed to edit the task");
    } finally {
      setEditingTask(false);
    }
  };

  return (
    <Card className="w-full h-full border-none shadow-none gap-4">
      <CardHeader className="flex p-4">
        <CardTitle className="text-lg font-bold">Edit Task</CardTitle>
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
                                  name={member.name ?? ""}
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

              {/* <FormField
                control={form.control}
                name="status"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Select Status</FormLabel>
                      <Select
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
                          <SelectItem value={TaskStatus.BACKLOG}>
                            BACKLOG
                          </SelectItem>
                          <SelectItem value={TaskStatus.DONE}>DONE</SelectItem>
                          <SelectItem value={TaskStatus.IN_PROGRESS}>
                            IN PROGRESS
                          </SelectItem>
                          <SelectItem value={TaskStatus.IN_REVIEW}>
                            IN REVIEW
                          </SelectItem>
                          <SelectItem value={TaskStatus.TODO}>TODO</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              /> */}

              {projectTaskStatus && (
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Select Status</FormLabel>
                        <Select
                          // defaultValue={
                          //   taskStatus === "ALL" || taskStatus === null
                          //     ? undefined
                          //     : taskStatus
                          // }

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
                              <SelectItem value={task}>
                                {task.toLocaleUpperCase()}
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
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Project" />
                          </SelectTrigger>
                        </FormControl>
                        <FormMessage />
                        <SelectContent>
                          {projectOptions.map((project) => (
                            <SelectItem key={project.id} value={project.id}>
                              <div className="flex items-center gap-x-2">
                                <ProjectAvatar
                                  name={project.name}
                                  className="size-6 truncate"
                                  image={project.imageUrl}
                                />
                                <p className="truncate">
                                  {truncateString(project.name, 2, 15)}
                                </p>
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
            </div>
            <DottedSeparator className="py-7" />
            <div className="flex items-center justify-between">
              <Button
                type="button"
                size="lg"
                variant="secondary"
                onClick={onCancel}
                disabled={form.formState.isSubmitting || isEditingTask}
                className={cn(!!onCancel ? "visible" : "invisible")}
              >
                Cancel
              </Button>
              <Button
                disabled={form.formState.isSubmitting || isEditingTask}
                type="submit"
                size="lg"
              >
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
