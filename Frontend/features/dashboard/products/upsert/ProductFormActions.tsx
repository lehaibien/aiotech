import { Box, Button } from "@mui/material";
import Link from "next/link";

export const FormActions = ({
  isLoading,
  isNew,
}: {
  isLoading: boolean;
  isNew: boolean;
}) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-end",
      position: "sticky",
      bottom: 0,
      right: 0,
      zIndex: 1000,
      background: "background.paper",
      p: 2,
      gap: 1,
    }}
  >
    <Button
      LinkComponent={Link}
      href="/dashboard/products"
      type="button"
      variant="contained"
      color="inherit"
      disabled={isLoading}
    >
      Hủy
    </Button>
    <Button
      type="submit"
      variant="contained"
      color="primary"
      disabled={isLoading}
    >
      {isLoading ? "Đang xử lý..." : isNew ? "Thêm mới" : "Cập nhật"}
    </Button>
  </Box>
);
