import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names into a single string, merging Tailwind CSS classes efficiently.
 * This utility function is used throughout the application for conditional class name handling.
 *
 * @param inputs - Class values to be combined (strings, objects, arrays, etc.)
 * @returns A merged string of class names optimized for Tailwind CSS
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
