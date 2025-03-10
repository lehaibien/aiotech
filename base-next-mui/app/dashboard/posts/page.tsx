import { Stack, Typography } from "@mui/material";
import NavBreadcrumbs from "@/components/core/NavBreadcrumbs";
import { PostContent } from "@/features/dashboard/posts/PostContent";

const breadcrums = [
  {
    label: "",
    href: "dashboard",
  },
  {
    label: "Quản lý sản phẩm",
    href: "?",
  },
];

export default async function Page() {
  return (
    <Stack gap={2}>
      <NavBreadcrumbs items={breadcrums} />
      <Typography variant="h5">Quản lý bài viết</Typography>
      <PostContent />
    </Stack>
  );
}
