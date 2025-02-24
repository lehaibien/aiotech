import 'server-only';

import { Stack, Typography } from '@mui/material';
import ReviewPage from './ReviewPage';

export default async function Page() {
  return (
    <Stack gap={2}>
      <Typography variant='h5'>Quản lý đánh giá</Typography>
      <ReviewPage />
    </Stack>
  );
}
