import { Button, Group } from "@mantine/core";
import Link from "next/link";

export const FormActions = ({
  isLoading,
  isNew,
}: {
  isLoading: boolean;
  isNew: boolean;
}) => (
  <Group
    w='100%'
    justify="flex-end"
    style={{
      position: "sticky",
      bottom: 0,
      right: 0,
      zIndex: 1000,
    }}
  >
    <Button
      component={Link}
      href="/dashboard/products"
      type="button"
      variant="outline"
      disabled={isLoading}
    >
      Hủy
    </Button>
    <Button type="submit" disabled={isLoading} loading={isLoading}>
      {isNew ? "Thêm mới" : "Cập nhật"}
    </Button>
  </Group>
);
