import { ReviewContent } from "@/features/dashboard/reviews/ReviewContent";
import { Stack, Typography } from "@mui/material";

export default async function Page() {
  return (
    <Stack spacing={2}>
      <Typography variant="h5">Quản lý đánh giá</Typography>
      <ReviewContent />
    </Stack>
  );
}
