import 'server-only';

import { Stack, Typography } from '@mui/material';
import NavBreadcrumbs from '@/components/core/NavBreadcrumbs';
import { ReviewContent } from '@/features/dashboard/reviews/ReviewContent';

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
      <ReviewContent />
    </Stack>
  );
}
