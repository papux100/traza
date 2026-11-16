import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...clases) {
  return twMerge(clsx(clases))
}
