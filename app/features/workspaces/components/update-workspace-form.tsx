import { useRef } from "react";
import { z } from "zod";
import { ArrowLeftIcon, CopyIcon, ImageIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { useCopyToClipboard } from "@uidotdev/usehooks";
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

import { updateWorkspaceSchema } from "../schema";
import { useUpdateWorkspace } from "../api/use-update-workspace";
import { useGenerateUploadUrl } from "@/hooks/use-generate-image-upload-url";
import { useRemoveWorkspace } from "../api/use-remove-workspace";
import { useResetWorkspaceLink } from "../api/use-reset-workspace-link";
import { useConfirm } from "@/hooks/use-confirm";
import { useNavigate } from "@tanstack/react-router";

interface updateWorkspaceFormProps {
  onCancel?: () => void;
  //   TODO: Omit some fields from this value
  initialValues: Omit<Doc<"workspaces">, "workspaceAvatar"> & {
    workspaceImage: string;
  };
  workspaceId: Id<"workspaces">;
}

export const UpdateWorkspaceForm = ({
  onCancel,
  initialValues,
  workspaceId,
}: updateWorkspaceFormProps) => {
  const navigate = useNavigate();
  const workspaceImageRef = useRef<HTMLImageElement>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const { mutate: updateWorkspace, isPending: isUpdatingWorkspace } =
    useUpdateWorkspace();
  const { mutate: resetWorkspaceLink, isPending: resettingWorkspaceLink } =
    useResetWorkspaceLink();
  const { mutate: removeWorkspace, isPending: removingWorkspace } =
    useRemoveWorkspace();

  const isLoading =
    removingWorkspace || resettingWorkspaceLink || isUpdatingWorkspace;
  const { handleSendImage } = useGenerateUploadUrl();
  const [confirm, ConfirmationModal] = useConfirm({
    title: "Delete Workspace",
    description: "This action cannot be undone",
    variant: "destructive",
  });
  const [confirmResetWorkspaceLink, ResetWorkspaceLinkConfirmationModal] =
    useConfirm({
      title: "Reset Workspace Link",
      description: "This will reset your workspace link for all members ",
      variant: "destructive",
    });
  const form = useForm<z.infer<typeof updateWorkspaceSchema>>({
    defaultValues: {
      ...initialValues,
      name: initialValues.workspaceName,
      image: initialValues.workspaceImage ?? "",
    },
    resolver: zodResolver(updateWorkspaceSchema),
  });

  const onSubmit = async (values: z.infer<typeof updateWorkspaceSchema>) => {
    try {
      const storageId = await handleSendImage(
        typeof values.image !== "string" ? values.image : undefined
      );
      if (workspaceImageRef.current)
        URL.revokeObjectURL(workspaceImageRef.current.src);
      updateWorkspace({
        workspaceName: values.name,
        workspaceImageId: storageId,
        workspaceId,
      });
    } catch (error) {
      toast.error(`There was an error while uploading the image  ${error}`);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) form.setValue("image", file);
  };

  const handleRemoveWorkspace = async () => {
    const ok = await confirm();
    if (!ok) return;

    removeWorkspace(
      {
        workspaceId,
      },
      {
        onSuccess() {
          // redirect the user to the home page
          navigate({ to: "/" });
        },
      }
    );
  };

  const handleResetWorkspaceLink = async () => {
    const ok = await confirmResetWorkspaceLink();
    if (!ok) return;

    resetWorkspaceLink({ workspaceId });
  };

  const [, setValue] = useCopyToClipboard();
  const resetLink = `${window.location.origin}/workspaces/${initialValues._id}/join/${initialValues.workspaceInviteCode}`;
  const copyResetLinkToClipboard = async () => {
    await setValue(resetLink);
    toast.success("Reset link copied");
  };

  return (
    <div className="flex flex-col gap-y-4 ">
      <ConfirmationModal />
      <ResetWorkspaceLinkConfirmationModal />

      <Card className="w-full h-full border-none shadow-none">
        <CardHeader className="flex flex-row items-center justify-between gap-x-4 space-y-0 p-7">
          <Button
            onClick={
              onCancel
                ? onCancel
                : () =>
                    navigate({
                      to: `/workspaces/$workspaceId`,
                      params: { workspaceId },
                    })
            }
            variant="secondary"
            size="sm"
          >
            <ArrowLeftIcon className="size-4 mr-2" />
            Back
          </Button>
          <CardTitle className="text-lg font-bold">
            {initialValues.workspaceName}
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
                        <FormLabel>Workspace Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter Workspace Name"
                            {...field}
                            disabled={isLoading}
                          />
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
                            <p className="test-sm">Workspace Icon</p>
                            <p className="test-sm text-muted-foreground">
                              JPG, PNG, SVG or JPEG, max1 mb
                            </p>
                            <input
                              className="hidden"
                              type="file"
                              accept=".jpg, .png, .jpeg, .svg"
                              ref={inputRef}
                              // disabled={isCreatingWorkspace}
                              onChange={handleImageChange}
                              disabled={isLoading}
                              // {...field}
                            />
                            {field?.value ? (
                              <Button
                                type="button"
                                disabled={
                                  form.formState.isSubmitting || isLoading
                                }
                                variant="destructive"
                                size="xs"
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
                                disabled={
                                  form.formState.isSubmitting || isLoading
                                }
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
                  disabled={form.formState.isSubmitting || isLoading}
                  className={cn(!!onCancel ? "visible" : "invisible")}
                >
                  Cancel
                </Button>
                <Button
                  disabled={form.formState.isSubmitting || isLoading}
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
            <h3 className="font-bold">Invite Members</h3>
            <p className="text-sm text-muted-foreground">
              Use the invite link to add members to your workspace
            </p>

            {/* TODO:  ADD INPUT AND BUTTON FOR COPYING THE INVITE-LINK*/}
            <div className="mt-4">
              <div className="flex items-center gap-x-2">
                <Input disabled value={resetLink} name="workspace-link" />
                <Button
                  onClick={copyResetLinkToClipboard}
                  variant="secondary"
                  className={"size-12"}
                >
                  <CopyIcon className={"size-5"} />
                </Button>
              </div>
            </div>
            <DottedSeparator className={"py-7"} />
            <Button
              type="button"
              size="sm"
              className="mt-6 w-fit ml-auto"
              variant="destructive"
              disabled={
                resettingWorkspaceLink || isUpdatingWorkspace || isLoading
              }
              onClick={handleResetWorkspaceLink}
            >
              Reset invite link
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full h-full border-none shadow-none">
        <CardContent className="p-7">
          <div className="flex flex-col">
            <h3 className="font-bold">Danger Zone</h3>
            <p className="text-sm text-muted-foreground">
              Deleting a workspace is irreversible and will remove all
              associated data.
            </p>
            <DottedSeparator className={"py-7"} />
            <Button
              type="button"
              size="sm"
              className="mt-6 w-fit ml-auto"
              variant="destructive"
              disabled={removingWorkspace || isUpdatingWorkspace || isLoading}
              onClick={handleRemoveWorkspace}
            >
              Delete Workspace
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
