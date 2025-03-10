import { Stack, Typography } from '@mui/material';
import NavBreadcrumbs from '@/components/core/NavBreadcrumbs';
import { BrandContent } from '@/features/dashboard/brands/BrandContent';

const breadcrums = [
  {
    label: "",
    href: "dashboard",
  },
  {
    label: "Quản lý thương hiệu",
    href: "?",
  },
];

export default async function Page() {
  return (
    <Stack gap={2}>
      <NavBreadcrumbs items={breadcrums} />
      <Typography variant='h5'>Quản lý thương hiệu</Typography>
      <BrandContent />
    </Stack>
  );
}
