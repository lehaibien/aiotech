import 'server-only';

import { Stack, Typography } from '@mui/material';
import ReviewPage from './ReviewPage';
import NavBreadcrumbs from '@/components/core/NavBreadcrumbs';

const breadcrums = [
  {
    label: "",
    href: "dashboard",
  },
  {
    label: "Quản lý đánh giá",
    href: "?",
  },
];

export default async function Page() {
  return (
    <Stack gap={2}>
      <NavBreadcrumbs items={breadcrums} />
      <Typography variant='h5'>Quản lý đánh giá</Typography>
      <ReviewPage />
    </Stack>
  );
}
