import { UserContent } from "@/features/dashboard/users/UserContent";
import { Stack, Typography } from "@mui/material";

export default function Page() {
  return (
    <Stack spacing={2}>
      <Typography variant="h5">Quản lý tài khoản</Typography>
      <UserContent />
    </Stack>
  );
}
