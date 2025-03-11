import NavBreadcrumbs from "@/components/core/NavBreadcrumbs";
import { UserContent } from "@/features/dashboard/users/UserContent";
import { Stack, Typography } from "@mui/material";
import "server-only";

const breadcrums = [
  {
    label: "",
    href: "dashboard",
  },
  {
    label: "Quản lý tài khoản",
    href: "?",
  },
];

export default function Page() {
  return (
    <Stack gap={2}>
      <NavBreadcrumbs items={breadcrums} />
      <Typography variant="h5">Quản lý tài khoản</Typography>
      <UserContent />
    </Stack>
  );
}
