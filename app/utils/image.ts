export function assertImageUpdate(image: File | string) {
  if (typeof image === "string") {
    if (image.length === 0) {
      return undefined;
    } else {
      return;
    }
  }

  return image;
}

// export function assertImageCreate(image: File | undefined) {
//   // return image ? image
// }
