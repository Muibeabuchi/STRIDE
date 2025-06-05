import { useRef } from "react";
import { z } from "zod";
import { ImageIcon } from "lucide-react";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

import { createProjectSchema } from "../schema";
import { useCreateProject } from "../api/use-create-project";

import { useGenerateUploadUrl } from "@/hooks/use-generate-image-upload-url";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useNavigate } from "@tanstack/react-router";

interface CreateProjectFormProps {
  onCancel?: () => void;
}

export const CreateProjectForm = ({ onCancel }: CreateProjectFormProps) => {
  const navigate = useNavigate();
  const workspaceId = useWorkspaceId();
  if (!workspaceId) throw new Error("workspaceId is not defined");
  const workspaceImageRef = useRef<HTMLImageElement>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { mutate: createProject, isPending: isCreatingProject } =
    useCreateProject();
  const { handleSendImage } = useGenerateUploadUrl();
  const form = useForm<z.infer<typeof createProjectSchema>>({
    defaultValues: {
      name: "",
      image: undefined,
    },
    resolver: zodResolver(createProjectSchema),
  });

  const onSubmit = async (values: z.infer<typeof createProjectSchema>) => {
    try {
      if (workspaceImageRef.current)
        URL.revokeObjectURL(workspaceImageRef.current.src);
      createProject(
        {
          projectName: values.name,
          projectImage: !values.image
            ? undefined
            : await handleSendImage(values.image),
          workspaceId,
        },
        {
          onSuccess(projectId) {
            form.reset();
            onCancel?.();
            navigate({
              to: "/workspaces/$workspaceId/projects/$projectId",
              params: {
                workspaceId,
                projectId,
              },
              search: (search) => ({
                ...search,
                projectId,
              }),
            });
          },
        }
      );
    } catch (error) {
      toast.error(`There was an error while uploading the image  ${error}`);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) form.setValue("image", file);
  };

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="flex p-7">
        <CardTitle className="text-lg fontbold">Create a new Project</CardTitle>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Project Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Project Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name="image"
                render={({ field }) => {
                  return (
                    <div className="flex flex-col gap-y-2">
                      <div className="flex items-center gap-x-5">
                        {field.value ? (
                          <div className="size-[72px] overflow-hidden rounded-md relative">
                            <img
                              src={
                                field.value instanceof File
                                  ? URL.createObjectURL(field.value)
                                  : field.value
                              }
                              ref={workspaceImageRef}
                              alt="logo"
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <Avatar className="size-[72px]">
                            <AvatarFallback>
                              <ImageIcon className="size-[36px]" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div className="flex flex-col">
                          <p className="test-sm">Project Icon</p>
                          <p className="test-sm text-muted-foreground">
                            JPG, PNG, SVG or JPEG, max1 mb
                          </p>
                          <input
                            className="hidden"
                            type="file"
                            accept=".jpg, .png, .jpeg, .svg"
                            ref={inputRef}
                            disabled={isCreatingProject}
                            onChange={handleImageChange}
                            // {...field}
                          />
                          {field?.value ? (
                            <Button
                              type="button"
                              disabled={form.formState.isSubmitting}
                              variant="destructive"
                              size="default"
                              className="w-fit mt-2"
                              onClick={() => {
                                field.onChange(null);
                                if (inputRef.current) {
                                  inputRef.current.value = "";
                                }
                                if (workspaceImageRef.current) {
                                  URL.revokeObjectURL(
                                    workspaceImageRef.current.src
                                  );
                                }
                              }}
                            >
                              Remove Image
                            </Button>
                          ) : (
                            <Button
                              type="button"
                              disabled={form.formState.isSubmitting}
                              // variant=""
                              // size="xs"
                              className="w-fit mt-2"
                              onClick={() => inputRef.current?.click?.()}
                            >
                              Upload Image
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
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
                disabled={form.formState.isSubmitting}
                type="submit"
                size="lg"
              >
                Create Project
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
