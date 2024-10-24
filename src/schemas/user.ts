import { z } from 'zod';

export const loginFormSchema = z.object({
  dealerId: z
    .string()
    .min(1, 'Dealer ID should be atleast 1 character')
    .max(12, 'Dealer ID cannot exceed 12 characters'),
  password: z
    .string()
    .min(3, 'Password should be atleast 3 characters')
    .max(25, 'Password cannot exceed 25 characters'),
});
