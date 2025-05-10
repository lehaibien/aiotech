import { DataTableSearchInput } from "@/components/data-table/DataTableSearchInput";
import { API_URL } from "@/constant/apiUrl";
import { deleteListApi } from "@/lib/apiClient";
import { CategoryResponse } from "@/types";
import { Button, Group } from "@mantine/core";
import { useDebouncedCallback } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { Plus, Trash } from "lucide-react";
import Link from "next/link";
import { useCallback } from "react";

type CategoryToolbarProps = {
  selectedRows: CategoryResponse[];
  onSearch: (searchTerm: string) => void;
};

export const CategoryToolbar = ({
  selectedRows,
  onSearch,
}: CategoryToolbarProps) => {
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
    const response = await deleteListApi(API_URL.category, ids);
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

  const debounceSearch = useDebouncedCallback(handleSearchQueryChange, 500);
  return (
    <Group justify="space-between">
      <Group>
        <Button
          variant="filled"
          leftSection={<Plus />}
          component={Link}
          href="/dashboard/categories/upsert"
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
      <DataTableSearchInput onChange={debounceSearch} />
    </Group>
  );
};
