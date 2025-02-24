import { Stack, Typography } from '@mui/material';
import BrandPage from './BrandPage';

export default async function Page() {
  return (
    <Stack gap={2}>
      <Typography variant='h5'>Quản lý thương hiệu</Typography>
      <BrandPage />
    </Stack>
  );
}
