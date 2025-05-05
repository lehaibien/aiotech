import { postRequestSchema } from "@/schemas/postSchema";
import { UUID } from "@/types";
import { z } from "zod";

export type PostListItemResponse = {
  id: UUID;
  title: string;
  slug: string;
  thumbnailUrl: string;
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
  updatedDate: Date;
};

export type PostUpdateResponse = {
  id: UUID;
  title: string;
  slug: string;
  content: string;
  imageUrl: string;
  isPublished: boolean;
  tags: string[];
};

export type PostRequest = z.infer<typeof postRequestSchema>;
