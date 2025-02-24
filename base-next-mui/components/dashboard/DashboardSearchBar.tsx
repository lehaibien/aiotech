import { useCallback, useMemo } from "react";
import { SearchToolBar } from "../core/SearchToolBar";
import { CustomDataGridRef } from "../core/CustomDataGrid";
import { debounce } from "@mui/material";

type DashboardSearchBarProps = {
  textSearchRef: React.MutableRefObject<string>;
  dataGridRef: React.RefObject<CustomDataGridRef>;
};

export function DashboardSearchBar({
  textSearchRef: textSearch,
  dataGridRef,
}: DashboardSearchBarProps) {
  const handleSearchQueryChange = useCallback(
    (searchTerm: string) => {
      const trimmedSearch = searchTerm.trim();
      textSearch.current = trimmedSearch;
      dataGridRef.current?.reload();
    },
    [dataGridRef, textSearch]
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
