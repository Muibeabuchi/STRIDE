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

import { createWorkspaceSchema } from "../schema";
import { useCreateWorkspace } from "../api/use-create-workspace";
import { useGenerateUploadUrl } from "@/hooks/use-generate-image-upload-url";
import { useRouter } from "@tanstack/react-router";

interface createWorkspaceFormProps {
  onCancel?: () => void;
}

export const CreateWorkspaceForm = ({ onCancel }: createWorkspaceFormProps) => {
  const router = useRouter();
  const workspaceImageRef = useRef<HTMLImageElement>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { mutate: createWorkspace, isPending: isCreatingWorkspace } =
    useCreateWorkspace();
  const { handleSendImage } = useGenerateUploadUrl();
  const form = useForm<z.infer<typeof createWorkspaceSchema>>({
    defaultValues: {
      name: "",
      image: undefined,
    },
    resolver: zodResolver(createWorkspaceSchema),
  });

  const onSubmit = async (values: z.infer<typeof createWorkspaceSchema>) => {
    try {
      // const storageId = await handleSendImage(values.image);
      if (workspaceImageRef.current)
        URL.revokeObjectURL(workspaceImageRef.current.src);
      createWorkspace(
        {
          workspaceName: values.name,
          workspaceImageId: !values.image
            ? undefined
            : await handleSendImage(values.image),
        },
        {
          onSuccess(data) {
            form.reset();
            onCancel?.();
            router.navigate({
              to: "/workspaces/$workspaceId",
              params: {
                workspaceId: data,
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
    console.log(file);
    if (file) form.setValue("image", file);
  };

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="flex p-7">
        <CardTitle className="text-lg font-bold">
          Create a new Workspace
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
                        <Input placeholder="Enter Workspace Name" {...field} />
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
                              variant="territory"
                              size="xs"
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
                disabled={form.formState.isSubmitting || isCreatingWorkspace}
                className={cn(!!onCancel ? "visible" : "invisible")}
              >
                Cancel
              </Button>
              <Button
                disabled={form.formState.isSubmitting || isCreatingWorkspace}
                type="submit"
                size="lg"
              >
                Create Workspace
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
