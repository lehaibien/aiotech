import { Stack, Typography } from "@mui/material";
import { PostView } from "./PostPage";
import NavBreadcrumbs from "@/components/core/NavBreadcrumbs";

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
      <PostView />
    </Stack>
  );
}
