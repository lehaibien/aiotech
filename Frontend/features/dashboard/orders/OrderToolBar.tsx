import { DataTableSearchInput } from "@/components/data-table/DataTableSearchInput";
import { Button, Group } from "@mantine/core";
import { useDebouncedCallback } from "@mantine/hooks";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useCallback } from "react";

type OrderToolbarProps = {
  onSearch: (searchTerm: string) => void;
};

export const OrderToolbar = ({ onSearch }: OrderToolbarProps) => {
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
          href="/dashboard/orders/new"
        >
          Thêm mới
        </Button>
      </Group>
      <DataTableSearchInput onChange={debounceSearch} />
    </Group>
  );
};
