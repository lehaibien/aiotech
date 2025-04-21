import { PostContent } from "@/features/dashboard/posts/PostContent";
import { Stack, Typography } from "@mui/material";

export default async function Page() {
  return (
    <Stack gap={2}>
      <Typography variant="h5">Quản lý bài viết</Typography>
      <PostContent />
    </Stack>
  );
}
