import { useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { toast } from "sonner";

const allowedImageTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/svg+xml",
];

export const useGenerateUploadUrl = () => {
  // ? Decouple this mutation form the workspace feature
  const generateUploadUrl = useMutation(api.upload.generateUploadUrl);

  const handleSendImage = async (image: File | undefined) => {
    if (!image) return;
    // try {
    if (image.size > 1024 * 1024)
      throw new Error("File must be less than 1 mb");
    if (!allowedImageTypes.includes(image.type))
      throw new Error("File must either be an JPG,PNG,JPEG or Svg");
    const postUrl = await generateUploadUrl();

    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": image.type! },
      body: image,
    });

    const json = await result.json();

    if (!result.ok) throw new Error(`Upload failed: ${JSON.stringify(json)}`);

    const { storageId } = json;

    return storageId as Id<"_storage">;
    // } catch (error) {
    // toast.error(`Failed to upload Image: ${error}`);
    // }
  };

  return { handleSendImage };
};
