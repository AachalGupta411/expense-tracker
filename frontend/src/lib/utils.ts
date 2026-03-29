import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** shadcn-style class merge — use when you add more `@/components/ui` primitives */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
