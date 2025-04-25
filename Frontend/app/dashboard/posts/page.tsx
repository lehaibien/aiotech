import { PostContent } from "@/features/dashboard/posts/PostContent";
import { Stack, Typography } from "@mui/material";

/**
 * Renders the post management page with a header and post content.
 *
 * Displays a heading and the main post management interface using Material-UI components.
 */
export default async function Page() {
  return (
    <Stack spacing={2}>
      <Typography variant="h5">Quản lý bài viết</Typography>
      <PostContent />
    </Stack>
  );
}
