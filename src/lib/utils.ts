import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Next/Image cannot optimize placehold.co; use unoptimized={true} when true. */
export function isPlaceholderCoUrl(src: string): boolean {
  return src.startsWith('https://placehold.co')
}
