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
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { Box, Chip, Divider, Paper, Stack, Typography } from "@mui/material";
import Image from "next/image";

type Params = Promise<{ slug: string }>;

/**
 * Retrieves a blog post by its slug from the API.
 *
 * @param slug - The unique slug identifier for the blog post.
 * @returns The post data if found; otherwise, undefined if the API call fails or the post does not exist.
 */
async function getPostBySlug(slug: string) {
  const response = await getApi(API_URL.post + `/slug/${slug}`);
  if (response.success) {
    return response.data as PostResponse;
  }
  return undefined;
}

/**
 * Retrieves related blog posts for a given post ID.
 *
 * @param id - The unique identifier of the blog post to find related posts for.
 * @returns An array of related post items, or an empty array if none are found or the API call fails.
 */
async function getRelatedPosts(id: UUID) {
  const response = await getApi(API_URL.postRelated(id));
  if (response.success) {
    return response.data as PostListItemResponse[];
  }
  return [];
}

/**
 * Renders a blog post page with its content, metadata, and related posts.
 *
 * Fetches the blog post by slug and displays its details, including title, image, formatted creation date, and content. If the post is not found or unpublished, shows a fallback message. Also displays a table of contents and a grid of related posts if available.
 *
 * @param params - An object containing a promise that resolves to the route parameters, including the blog post slug.
 *
 * @returns The blog post page UI, or a fallback UI if the post is not found or unpublished.
 */
export default async function Page({ params }: { params: Params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  const relatedPosts = await getRelatedPosts(post!.id);
  if (post === undefined || post.isPublished === false) {
    return (
      <NoItem
        icon={CalendarTodayIcon}
        title="Không tìm thấy bài viết"
        description="Vui lòng thử lại sau hoặc đọc bài viết khác"
      />
    );
  }

  const postDate = dayjs(post.createdDate).tz(DEFAULT_TIMEZONE);
  const formattedDate = postDate.format("DD/MM/YYYY");
  const hours = postDate.format("HH");
  const minutes = postDate.format("mm");

  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        flexDirection: { xs: "column", md: "row" },
      }}
    >
      <Box sx={{ width: { xs: 0, md: 280 }, flexShrink: 0 }}>
        <TableOfContents html={post.content} />
      </Box>

      <Box sx={{ flexGrow: 1 }}>
        <Paper
          elevation={2}
          sx={{ borderRadius: 2, overflow: "hidden", mb: 4 }}
        >
          <Box sx={{ position: "relative" }}>
            <Chip
              label="Bài viết"
              size="small"
              color="primary"
              sx={{
                position: "absolute",
                top: 8,
                left: 8,
                zIndex: 2,
              }}
            />
            <Box
              sx={{
                position: "relative",
                width: "100%",
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
                src={
                  post.imageUrl == "" ? "/image-not-found.jpg" : post.imageUrl
                }
                alt={post.title}
                width={1200}
                height={630}
                priority
                style={{
                  width: "100%",
                  aspectRatio: 1200 / 630,
                  objectFit: "fill",
                }}
              />
            </Box>
          </Box>

          {/* Content */}
          <Stack padding={2} spacing={2}>
            {/* Title and Meta */}
            <Stack spacing={2}>
              <Typography component="h2" variant="h1">
                {post.title}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <CalendarTodayIcon fontSize="small" />
                  <Typography variant="body2">{formattedDate}</Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <AccessTimeIcon fontSize="small" />
                  <Typography variant="body2">
                    {hours}:{minutes}
                  </Typography>
                </Box>
              </Box>

              <Divider />
            </Stack>

            <HtmlContent content={post.content} />
          </Stack>
        </Paper>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <Box sx={{}}>
            <Typography
              variant="h5"
              component="h2"
              gutterBottom
              sx={{
                borderBottom: "2px solid",
                borderColor: "primary.main",
                display: "inline-block",
              }}
            >
              Bài viết liên quan
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(3, 1fr)",
                },
                gap: 2,
              }}
            >
              {relatedPosts.map((post) => (
                <BlogPostItem
                  key={post.id}
                  slug={post.slug}
                  title={post.title}
                  imageUrl={post.thumbnailUrl}
                  createdDate={post.createdDate}
                />
              ))}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
