import { Stack, Typography } from "@mui/material";
import { PostView } from "./PostPage";

export default async function Page() {
  return (
    <Stack gap={2}>
      <Typography variant="h5">Quản lý bài viết</Typography>
      <PostView />
    </Stack>
  );
}
