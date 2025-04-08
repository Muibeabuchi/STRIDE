import { useRef } from "react";
import { z } from "zod";
import { ArrowLeftIcon, CopyIcon, ImageIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Doc, Id } from "convex/_generated/dataModel";
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
import { useConfirm } from "@/hooks/use-confirm";

import { useUpdateProject } from "../api/use-update-project";
import { useGenerateUploadUrl } from "../../../hooks/use-generate-image-upload-url";
import { updateProjectSchema } from "../schema";
import { useRemoveProject } from "../api/use-remove-project";
import { useNavigate } from "@tanstack/react-router";
import { assertImageUpdate } from "@/utils/image";

interface updateProjectFormProps {
  onCancel?: () => void;
  //   TODO: Omit some fields from this value
  initialValues: Omit<Doc<"projects">, "projectImage"> & {
    projectImage: string;
  };
  projectId?: Id<"projects">;
  workspaceId?: Id<"workspaces">;
}

export const UpdateProjectForm = ({
  onCancel,
  initialValues,
}: updateProjectFormProps) => {
  const navigate = useNavigate();
  const workspaceImageRef = useRef<HTMLImageElement>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { mutate: updateProject, isPending: isUpdatingProject } =
    useUpdateProject();
  const { mutate: removeProject, isPending: removingProject } =
    useRemoveProject();
  const { handleSendImage } = useGenerateUploadUrl();
  const [confirm, ConfirmationModal] = useConfirm({
    title: "Delete Project",
    description: "This action cannot be undone",
    variant: "destructive",
  });
  const form = useForm<z.infer<typeof updateProjectSchema>>({
    defaultValues: {
      ...initialValues,
      name: initialValues.projectName,
      image: initialValues.projectImage,
    },
    resolver: zodResolver(updateProjectSchema),
  });

  const onSubmit = async (values: z.infer<typeof updateProjectSchema>) => {
    if (typeof values.image === "string" && values.image.length !== 0) return;
    if (initialValues.projectName === values.name) return;
    try {
      const image = assertImageUpdate(values.image);

      if (workspaceImageRef.current)
        URL.revokeObjectURL(workspaceImageRef.current.src);

      updateProject(
        {
          projectName: values.name || initialValues.projectName,
          projectImage: image ? await handleSendImage(image) : undefined,
          projectId: initialValues._id,
          workspaceId: initialValues.workspaceId,
        },
        {
          onSuccess() {
            navigate({
              to: "/workspaces/$workspaceId",
              params: {
                workspaceId: initialValues.workspaceId,
              },
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

  const handleRemoveProject = async () => {
    const ok = await confirm();
    if (!ok) return;

    removeProject(
      {
        workspaceId: initialValues.workspaceId,
        projectId: initialValues._id,
      },
      {
        onSuccess() {
          // redirect the user to the home page
          navigate({
            to: "/workspaces/$workspaceId",
            params: {
              workspaceId: initialValues.workspaceId,
            },
          });
        },
      }
    );
  };

  return (
    <div className="flex flex-col gap-y-4 ">
      <ConfirmationModal />

      <Card className="w-full h-full border-none shadow-none">
        <CardHeader className="flex flex-row items-center justify-between gap-x-4 space-y-0 p-7">
          <Button
            onClick={
              onCancel
                ? onCancel
                : () =>
                    navigate({
                      to: "/workspaces/$workspaceId/projects/$projectId",
                      params: {
                        workspaceId: initialValues.workspaceId,
                        projectId: initialValues._id,
                      },
                    })
            }
            variant="secondary"
            size="sm"
          >
            <ArrowLeftIcon className="size-4 mr-2" />
            Back
          </Button>
          <CardTitle className="text-lg fontbold">
            {initialValues.projectName}
          </CardTitle>
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
                              hidden
                              accept=".jpg, .png, .jpeg, .svg"
                              ref={inputRef}
                              // disabled={isCreatingWorkspace}
                              onChange={handleImageChange}
                              // {...field}
                            />
                            {field?.value ? (
                              <Button
                                type="button"
                                disabled={form.formState.isSubmitting}
                                variant="destructive"
                                size="xs"
                                className="w-fit mt-2"
                                onClick={() => {
                                  field.onChange("");
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
                                variant="territory"
                                size="xs"
                                className="w-fit mt-2"
                                onClick={() => inputRef.current?.click?.()}
                              >
                                Upload Image
                              </Button>
                            )}{" "}
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
                  Save Changes
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="w-full h-full border-none shadow-none">
        <CardContent className="p-7">
          <div className="flex flex-col">
            <h3 className="font-bold">Danger Zone</h3>
            <p className="text-sm text-muted-foreground">
              Deleting a project is irreversible and will remove all associated
              data.
            </p>
            <DottedSeparator className={"py-7"} />
            <Button
              type="button"
              size="sm"
              className="mt-6 w-fit ml-auto"
              variant="destructive"
              disabled={removingProject || isUpdatingProject}
              onClick={handleRemoveProject}
            >
              Delete Workspace
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
