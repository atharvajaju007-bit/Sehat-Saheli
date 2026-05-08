/**
 * Utility functions for className merging.
 * Combines clsx (conditional classes) with tailwind-merge (dedup Tailwind classes).
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
