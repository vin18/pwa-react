import { z } from 'zod';

export const callSchema = z.object({
  id: z.string(),
  name: z.string(),
  phoneNumber: z.string(),
  duration: z.string(),
  type: z.string(),
  date: z.string(), // TODO: Make it UTC datetimestamp
  remarks: z.string(),
});

export type Call = z.infer<typeof callSchema>;
