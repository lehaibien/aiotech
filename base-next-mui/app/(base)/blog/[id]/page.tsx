import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Container,
  Divider,
  Typography,
} from "@mui/material";
import type { UUID } from "crypto";

// Import the PostResponse type
import NoItem from "@/components/core/NoItem";
import { API_URL } from "@/constant/apiUrl";
import { getByIdApi } from "@/lib/apiClient";
import { formatDate, HTMLPartToTextPart, parseUUID } from "@/lib/utils";
import type { PostResponse } from "@/types";
import Image from "next/image";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const parsedId = parseUUID(params.id);
  const response = await getByIdApi(API_URL.post, { id: parsedId });
  if (response.success) {
    const post = response.data as PostResponse;
    const content = HTMLPartToTextPart(post.content)
      .trim()
      .split(" ")
      .slice(0, 30)
      .join(" ");
    return {
      title: post.title,
      description: content,
      keywords: [...post.tags],
      openGraph: {
        title: post.title,
        description: content,
        images: {
          url: post.imageUrl,
          width: 500,
          height: 500,
          alt: post.title,
        },
      },
    };
  }
  return {};
}

export default async function PostPage({ params }: { params: { id: UUID } }) {
  let post: PostResponse | undefined;
  const id = params.id;
  const parsedId = parseUUID(id);
  const response = await getByIdApi(API_URL.post, { id: parsedId });
  if (response.success) {
    post = response.data as PostResponse;
  }

  if (post === undefined) {
    return (
      <NoItem
        icon={CalendarTodayIcon}
        title="Không tìm thấy bài viết"
        description="Vui lòng thử lại sau hoặc đọc bài viết khác"
      />
    );
  }

  return (
    <Container maxWidth="lg">
      <Card elevation={3}>
        <CardMedia>
          <Image
            src={post.imageUrl}
            alt={post.title}
            width={1150}
            height={400}
            style={{
              width: "100%",
              background: "white",
              aspectRatio: 16 / 9,
              objectFit: "cover",
            }}
          />
        </CardMedia>
        <CardContent>
          <Typography variant="h4" component="h1" gutterBottom>
            {post.title}
          </Typography>
          <Box display="flex" alignItems="center" mb={2}>
            <CalendarTodayIcon fontSize="small" sx={{ mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              {formatDate(post.createdDate)}
            </Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </CardContent>
      </Card>
    </Container>
  );
}
