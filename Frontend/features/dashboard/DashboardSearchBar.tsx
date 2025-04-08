import { DataTableRef } from "@/components/core/DataTable";
import { SearchToolBar } from "@/components/core/SearchToolBar";
import { debounce } from "@mui/material";
import { useCallback, useMemo } from "react";

type DashboardSearchBarProps = {
  dataGridRef: React.RefObject<DataTableRef>;
};

export function DashboardSearchBar({ dataGridRef }: DashboardSearchBarProps) {
  const handleSearchQueryChange = useCallback(
    (searchTerm: string) => {
      const trimmedSearch = searchTerm.trim();
      dataGridRef.current?.search(trimmedSearch);
    },
    [dataGridRef]
  );

  const debouncedSearch = useMemo(
    () => debounce(handleSearchQueryChange, 500),
    [handleSearchQueryChange]
  );
  return (
    <SearchToolBar
      onChange={debouncedSearch}
      sx={(theme) => ({
        marginLeft: "auto",
        [theme.breakpoints.down("md")]: {
          width: "100%",
        },
      })}
    />
  );
}
