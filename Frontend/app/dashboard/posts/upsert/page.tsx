import { API_URL } from '@/constant/apiUrl';
import { EMPTY_UUID } from '@/constant/common';
import { PostUpsertForm } from '@/features/dashboard/posts/upsert/PostUpsertForm';
import { getByIdApi } from '@/lib/apiClient';
import dayjs from '@/lib/extended-dayjs';
import { parseUUID } from '@/lib/utils';
import { PostResponse } from '@/types';
import { Stack, Typography } from '@mui/material';
import 'server-only';

export default async function UpsertPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined };
}) {
  let post: PostResponse = {
    id: EMPTY_UUID,
    title: '',
    content: '',
    imageUrl: '',
    isPublished: false,
    tags: [],
    createdDate: dayjs().toDate(),
  };
  const parsedId = parseUUID(searchParams?.id ?? '');
  if (parsedId !== EMPTY_UUID) {
    const response = await getByIdApi(API_URL.post, { id: parsedId });
    if (response.success) {
      post = response.data as PostResponse;
    }
  }
  return (
    <Stack>
      <Typography
        component='h1'
        variant='h4'>
        {post.id === null || post.id === EMPTY_UUID ? 'Thêm mới' : 'Cập nhật'}{' '}
        bài viết
      </Typography>
      <PostUpsertForm post={post} />
    </Stack>
  );
}
