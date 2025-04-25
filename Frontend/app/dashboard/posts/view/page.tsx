import { HtmlContent } from "@/components/core/HtmlContent";
import { API_URL } from "@/constant/apiUrl";
import { getByIdApi } from "@/lib/apiClient";
import { parseUUID } from "@/lib/utils";
import { PostResponse, SearchParams, UUID } from "@/types";
import { Stack, Typography } from "@mui/material";
import Image from "next/image";
import { notFound } from "next/navigation";

async function getPostById(id: UUID) {
  const response = await getByIdApi(API_URL.post, { id });
  if (response.success) {
    return response.data as PostResponse;
  }
  return null;
}

export default async function PostPreviewPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { id } = await searchParams;
  const parsedId = parseUUID(id);
  const post = await getPostById(parsedId);

  if (!post) {
    notFound();
  }

  return (
    <Stack spacing={2}>
      <Typography variant="h4" component="h1">
        {post.title}
      </Typography>
      {post.imageUrl && (
        <Image
          src={post.imageUrl}
          alt={post.title}
          width={1200}
          height={600}
          style={{
            objectFit: "fill",
            margin: "auto",
          }}
        />
      )}
      <HtmlContent content={post.content} />
    </Stack>
  );
}
