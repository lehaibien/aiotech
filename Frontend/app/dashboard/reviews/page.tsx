import { ReviewContent } from "@/features/dashboard/reviews/ReviewContent";
import { Stack, Typography } from "@mui/material";

/**
 * Renders the review management page with a heading and review content.
 *
 * Displays a header labeled "Quản lý đánh giá" and includes the {@link ReviewContent} component within a stacked layout.
 */
export default async function Page() {
  return (
    <Stack spacing={2}>
      <Typography variant="h5">Quản lý đánh giá</Typography>
      <ReviewContent />
    </Stack>
  );
}
