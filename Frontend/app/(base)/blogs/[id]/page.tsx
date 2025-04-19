import { HtmlContent } from '@/components/core/HtmlContent';
import { NoItem } from '@/components/core/NoItem';
import { API_URL } from '@/constant/apiUrl';
import { DEFAULT_TIMEZONE } from '@/constant/common';
import TableOfContents from '@/features/blog/TableOfContents';
import BlogPostItem from '@/features/home/BlogPostItem';
import { getApi, getByIdApi } from '@/lib/apiClient';
import dayjs from '@/lib/extended-dayjs';
import { HTMLPartToTextPart, parseUUID } from '@/lib/utils';
import type { PostResponse } from '@/types';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import {
  Box,
  Breadcrumbs,
  Chip,
  Divider,
  Paper,
  Typography
} from '@mui/material';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

type Params = Promise<{ id: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { id } = await params;
  const parsedId = parseUUID(id);
  const response = await getByIdApi(API_URL.post, { id: parsedId });
  if (response.success) {
    const post = response.data as PostResponse;
    const content = HTMLPartToTextPart(post.content)
      .trim()
      .split(' ')
      .slice(0, 30)
      .join(' ');
    return {
      title: post.title,
      description: content,
      keywords: [...post.tags],
      openGraph: {
        title: post.title,
        description: content,
        images: {
          url: post.imageUrl,
          width: 800,
          height: 600,
          alt: post.title,
        },
      },
    };
  }
  return {};
}

export default async function PostPage({ params }: { params: Params }) {
  let post: PostResponse | undefined;
  const { id } = await params;
  const parsedId = parseUUID(id);
  const response = await getByIdApi(API_URL.post, { id: parsedId });
  if (response.success) {
    post = response.data as PostResponse;
  }

  let relatedPosts: PostResponse[] = [];
  if (post) {
    const postResponse = await getApi(API_URL.postRelated(id));
    if (postResponse.success) {
      relatedPosts = postResponse.data as PostResponse[];
    }
  }

  if (post === undefined || post.isPublished === false) {
    return (
      <NoItem
        icon={CalendarTodayIcon}
        title='Không tìm thấy bài viết'
        description='Vui lòng thử lại sau hoặc đọc bài viết khác'
      />
    );
  }

  const postDate = dayjs(post.createdDate).tz(DEFAULT_TIMEZONE);
  const formattedDate = postDate.format('DD/MM/YYYY');
  const hours = postDate.format('HH');
  const minutes = postDate.format('mm');

  return (
    <>
      <Breadcrumbs
        aria-label='breadcrumb'
        sx={{ mb: 2 }}>
        <Link
          href='/'
          style={{
            color: 'inherit',
            textDecoration: 'none',
          }}>
          Trang chủ
        </Link>
        <Link
          href='/blogs'
          style={{
            color: 'inherit',
            textDecoration: 'none',
          }}>
          Tin tức
        </Link>
        <Typography>{post.title}</Typography>
      </Breadcrumbs>

      <Box
        sx={{
          display: 'flex',
          gap: 4,
          flexDirection: { xs: 'column', md: 'row' },
        }}>
        <Box sx={{ width: { xs: 0, md: 280 }, flexShrink: 0 }}>
          <TableOfContents html={post.content} />
        </Box>

        <Box sx={{ flexGrow: 1 }}>
          <Paper
            elevation={2}
            sx={{ borderRadius: 2, overflow: 'hidden', mb: 4 }}>
            <Box sx={{ position: 'relative' }}>
              <Chip
                label='Bài viết'
                size='small'
                color='primary'
                sx={{
                  position: 'absolute',
                  top: 8,
                  left: 8,
                  zIndex: 2,
                }}
              />
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    height: '30%',
                    background:
                      'linear-gradient(to top, rgba(0,0,0,0.4), transparent)',
                    zIndex: 1,
                  },
                }}>
                <Image
                  src={post.imageUrl}
                  alt={post.title}
                  width={1200}
                  height={630}
                  priority
                  style={{
                    width: '100%',
                    aspectRatio: 1200 / 630,
                    objectFit: 'fill',
                  }}
                />
              </Box>
            </Box>

            {/* Content */}
            <Box
              sx={{
                p: { xs: 3, md: 5 },
                display: 'flex',
                flexDirection: 'column',
              }}>
              {/* Title and Meta */}
              <Box sx={{ mb: 4 }}>
                <Typography
                  component='h2'
                  variant='h1'>
                  {post.title}
                </Typography>

                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    gap: 2,
                    mb: 3,
                  }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}>
                    <CalendarTodayIcon fontSize='small' />
                    <Typography variant='body2'>{formattedDate}</Typography>
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}>
                    <AccessTimeIcon fontSize='small' />
                    <Typography variant='body2'>
                      {hours}:{minutes}
                    </Typography>
                  </Box>

                  {post.tags && post.tags.length > 0 && (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: 1,
                      }}>
                      {post.tags.map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag}
                          size='small'
                          variant='outlined'
                          sx={{
                            borderRadius: 1,
                          }}
                        />
                      ))}
                    </Box>
                  )}
                </Box>

                <Divider />
              </Box>

              {/* Post Content */}
              <HtmlContent content={post.content} />
            </Box>
          </Paper>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <Box sx={{}}>
              <Typography
                variant='h5'
                component='h2'
                gutterBottom
                sx={{
                  borderBottom: '2px solid',
                  borderColor: 'primary.main',
                  display: 'inline-block',
                }}>
                Bài viết liên quan
              </Typography>

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'repeat(2, 1fr)',
                    md: 'repeat(3, 1fr)',
                  },
                  gap: 2,
                }}>
                {relatedPosts.map((post) => (
                  <BlogPostItem
                    key={post.id}
                    id={post.id}
                    title={post.title}
                    imageUrl={post.imageUrl}
                    createdDate={post.createdDate}
                  />
                ))}
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
}
