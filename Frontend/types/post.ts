import { postRequestSchema } from '@/schemas/postSchema';
import { UUID } from 'crypto';
import { z } from 'zod';

export type PostPreviewResponse = {
  id: UUID;
  title: string;
  imageUrl: string;
  createdDate: Date;
};

export type PostResponse = {
  id: UUID;
  title: string;
  content: string;
  imageUrl: string;
  isPublished: boolean;
  tags: string[];
  createdDate: Date;
};

export type PostRequest = z.infer<typeof postRequestSchema>;
