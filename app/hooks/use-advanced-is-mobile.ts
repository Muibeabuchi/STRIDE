import { useMediaQuery } from "usehooks-ts";

export function useIsMobile(displaySize: number = 768) {
  return useMediaQuery(`(min-width: ${displaySize}px)`);
}
