import { z } from 'zod';

export const reviewRequestSchema = z.object({
  productID: z.string().uuid(),
  userId: z.string().uuid(),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
});
