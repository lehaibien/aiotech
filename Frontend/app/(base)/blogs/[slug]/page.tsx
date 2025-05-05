import { HtmlContent } from "@/components/core/HtmlContent";
import { NoItem } from "@/components/core/NoItem";
import { API_URL } from "@/constant/apiUrl";
import { DEFAULT_TIMEZONE } from "@/constant/common";
import TableOfContents from "@/features/blog/TableOfContents";
import BlogPostItem from "@/features/home/BlogPostItem";
import { getApi } from "@/lib/apiClient";
import dayjs from "@/lib/extended-dayjs";
import type { PostListItemResponse, PostResponse } from "@/types";
import { UUID } from "@/types";
import {
  Box,
  Divider,
  Flex,
  Grid,
  GridCol,
  Group,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { Calendar, Clock } from "lucide-react";
import Image from "next/image";

type Params = Promise<{ slug: string }>;

async function getPostBySlug(slug: string) {
  const response = await getApi(API_URL.post + `/slug/${slug}`);
  if (response.success) {
    return response.data as PostResponse;
  }
  return undefined;
}

async function getRelatedPosts(id: UUID) {
  const response = await getApi(API_URL.postRelated(id));
  if (response.success) {
    return response.data as PostListItemResponse[];
  }
  return [];
}

export default async function Page({ params }: { params: Params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (post === undefined || post.isPublished === false) {
    return (
      <NoItem
        title="Không tìm thấy bài viết"
        description="Vui lòng thử lại sau hoặc đọc bài viết khác"
      />
    );
  }
  const relatedPosts = await getRelatedPosts(post.id);
  const postDate = dayjs(post.createdDate).tz(DEFAULT_TIMEZONE);
  const formattedDate = postDate.format("DD/MM/YYYY");
  const hours = postDate.format("HH");
  const minutes = postDate.format("mm");

  return (
    <Flex gap="md" direction={{ base: "column", md: "row" }}>
      <Box w={{ base: "100%", md: 280 }} miw={280}>
        <TableOfContents html={post.content} />
      </Box>

      <Box flex={1}>
        <Paper radius="md" mb="xl" withBorder>
          <Box
            pos="relative"
            w="100%"
            style={{
              "&::after": {
                content: '""',
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "100%",
                height: "30%",
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.4), transparent)",
                zIndex: 1,
              },
            }}
          >
            <Image
              src={post.imageUrl || "/image-not-found.jpg"}
              alt={post.title}
              width={1200}
              height={630}
              priority
              style={{
                width: "100%",
                aspectRatio: "1200/630",
                objectFit: "fill",
              }}
            />
          </Box>

          <Stack p="md" gap="md">
            <Stack gap="md">
              <Title order={1}>{post.title}</Title>

              <Group gap="md" wrap="wrap">
                <Group gap="xs">
                  <Calendar size={16} />
                  <Text size="sm" c="dimmed">
                    {formattedDate}
                  </Text>
                </Group>

                <Group gap="xs">
                  <Clock size={16} />
                  <Text size="sm" c="dimmed">
                    {hours}:{minutes}
                  </Text>
                </Group>
              </Group>

              <Divider />
            </Stack>

            <HtmlContent content={post.content} />
          </Stack>
        </Paper>

        {relatedPosts.length > 0 && (
          <Box>
            <Title
              order={2}
              mb="md"
              pb="xs"
              style={{
                borderBottom: "2px solid var(--mantine-color-blue-filled)",
                display: "inline-block",
              }}
            >
              Bài viết liên quan
            </Title>

            <Grid gutter="md">
              {relatedPosts.map((post) => (
                <GridCol key={post.id} span={{ base: 12, sm: 6, md: 4 }}>
                  <BlogPostItem
                    slug={post.slug}
                    title={post.title}
                    imageUrl={post.thumbnailUrl}
                    createdDate={post.createdDate}
                  />
                </GridCol>
              ))}
            </Grid>
          </Box>
        )}
      </Box>
    </Flex>
  );
}
