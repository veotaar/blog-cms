import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { z } from 'zod';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const wordCountValidator = (min: number, max: number) =>
  z
    .string()
    .min(4, {
      message: 'Comment must be at least 4 characters.',
    })
    .max(400, {
      message: 'Comment must not be longer than 400 characters.',
    })
    .superRefine((val, ctx) => {
      const wordCount = val.trim().split(/\s+/).length;

      if (wordCount < min || wordCount > max) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Word count must be between ${min} and ${max}`,
        });
        return z.INVALID;
      }

      return val;
    });
