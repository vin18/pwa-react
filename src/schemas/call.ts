import { z } from 'zod';

export const callSchema = z.object({
  clientId: z
    .string()
    .min(1, 'Client ID should be atleast 1 character')
    .max(12, 'Client ID cannot exceed 12 characters'),
  remarks: z.string(),
});

export type Call = z.infer<typeof callSchema>;
