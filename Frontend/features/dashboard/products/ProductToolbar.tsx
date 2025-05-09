import { DataTableSearchInput } from "@/components/data-table/DataTableSearchInput";
import { API_URL } from "@/constant/apiUrl";
import { deleteListApi } from "@/lib/apiClient";
import { ProductResponse } from "@/types";
import { Button, Group } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { debounce } from "@mui/material";
import { Plus, Trash } from "lucide-react";
import Link from "next/link";
import { useCallback, useMemo } from "react";

type ProductToolbarProps = {
  selectedRows: ProductResponse[];
  onSearch: (searchTerm: string) => void;
};

export const ProductToolbar = ({
  selectedRows,
  onSearch,
}: ProductToolbarProps) => {
  const handleDelete = async () => {
    if (selectedRows.length === 0) {
      notifications.show({
        title: "Hệ thống",
        message: "Vui lòng chọn ít nhất một đối tượng",
        color: "red",
      });
      return;
    }
    const ids = selectedRows.map((row) => row.id);
    const response = await deleteListApi(API_URL.product, ids);
    if (response.success) {
      notifications.show({
        title: "Hệ thống",
        message: `Xóa thành công ${ids.length} đối tượng`,
        color: "green",
      });
      return;
    }
    notifications.show({
      title: "Hệ thống",
      message: response.message,
      color: "red",
    });
  };
  const handleSearchQueryChange = useCallback(
    (searchTerm: string) => {
      const trimmedSearch = searchTerm.trim();
      onSearch(trimmedSearch);
    },
    [onSearch]
  );

  const debouncedSearch = useMemo(
    () => debounce(handleSearchQueryChange, 500),
    [handleSearchQueryChange]
  );
  return (
    <Group justify="space-between">
      <Group>
        <Button
          variant="filled"
          leftSection={<Plus />}
          component={Link}
          href="/dashboard/products/upsert"
        >
          Thêm mới
        </Button>
        <Button
          variant="filled"
          color="red"
          leftSection={<Trash />}
          onClick={handleDelete}
        >
          Xóa {selectedRows.length > 0 ? selectedRows.length + " dòng" : ""}
        </Button>
      </Group>
      <DataTableSearchInput onChange={debouncedSearch} />
    </Group>
  );
};
