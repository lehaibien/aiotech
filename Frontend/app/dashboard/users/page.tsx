import { UserContent } from "@/features/dashboard/users/UserContent";
import { Stack, Typography } from "@mui/material";

/**
 * Renders the account management page with a heading and user account content.
 *
 * Displays a header labeled "Quản lý tài khoản" and the {@link UserContent} component within a vertically spaced layout.
 */
export default function Page() {
  return (
    <Stack spacing={2}>
      <Typography variant="h5">Quản lý tài khoản</Typography>
      <UserContent />
    </Stack>
  );
}
