'use client';

import { NoItem } from '@/components/core/NoItem';
import { PostPreviewResponse } from '@/types/post';
import ArticleIcon from '@mui/icons-material/Article';
import { Box, Grid, Pagination } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback } from 'react';
import BlogPostItem from '../home/BlogPostItem';

type BlogListProps = {
  posts: PostPreviewResponse[];
  currentPage: number;
  totalPages: number;
};

export default function BlogList({
  posts,
  currentPage,
  totalPages,
}: BlogListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = useCallback(
    (event: React.ChangeEvent<unknown>, value: number) => {
      const params = new URLSearchParams(searchParams);
      params.set('page', value.toString());
      router.push(`?${params.toString()}`);
    },
    [router, searchParams]
  );

  if (posts.length === 0) {
    return (
      <Box sx={{ py: 8, textAlign: 'center' }}>
        <NoItem
          title='Không có bài viết nào'
          description='Hiện tại chưa có bài viết nào được đăng. Vui lòng quay lại sau.'
          icon={ArticleIcon}
        />
      </Box>
    );
  }

  return (
    <>
      <Grid
        container
        spacing={3}>
        {posts.map((post) => (
          <Grid
            size={{ xs: 12, sm: 6 }}
            key={post.id}>
            <BlogPostItem
              id={post.id}
              title={post.title}
              imageUrl={post.imageUrl}
              createdDate={post.createdDate}
              imgHeight={315}
            />
          </Grid>
        ))}
      </Grid>

      {totalPages > 1 && (
        <Box
          mt={4}
          display='flex'
          justifyContent='center'>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color='primary'
            size='large'
            showFirstButton
            showLastButton
          />
        </Box>
      )}
    </>
  );
}
