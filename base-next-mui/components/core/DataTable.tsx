"use client";

import NoRowOverlay from "@/components/core/NoRowOverlay";
import useColumns from "@/hooks/useColumns";
import { useDataTableFetch } from "@/hooks/useDataTableFetch";
import { alpha, Box } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridDensity,
  GridPaginationModel,
  GridRowSelectionModel,
  GridSortModel,
} from "@mui/x-data-grid";
import React, {
  ForwardedRef,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import CustomDataGridPagination from "./CustomDataGridPagination";
import ErrorOverlay from "./ErrorOverlay";

export type DataTableProps = {
  columns: GridColDef[];
  apiUrl: string;
  checkboxSelection?: boolean;
  withRowNumber?: boolean;
  height?: number;
  density?: GridDensity;
};

export type DataTableRef = {
  rowSelectionModel: GridRowSelectionModel;
  reload: () => void;
  clearSelection: () => void;
  search: (search: string) => void;
};

function DataTable<T>(
  {
    columns,
    apiUrl,
    checkboxSelection,
    withRowNumber,
    height = 600,
    density = "standard",
  }: DataTableProps,
  ref: ForwardedRef<DataTableRef>
) {
  useImperativeHandle(ref, () => ({
    rowSelectionModel: rowSelectionModel,
    reload: () => mutate(),
    search: (search: string) => {
      textSearch.current = search;
      mutate();
    },
    clearSelection: () => setRowSelectionModel([]),
  }));

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const textSearch = useRef("");

  const [rowSelectionModel, setRowSelectionModel] =
    useState<GridRowSelectionModel>([]);

  // Add row number column if needed
  const gridColumn = useColumns({
    columns: columns,
    withRowNumber: withRowNumber,
  });

  const { data, error, isValidating, mutate } = useDataTableFetch<T>({
    apiUrl: apiUrl,
    paginationModel,
    sortModel: sortModel[0],
    textSearch: textSearch.current,
  });
  const rowRef = React.useRef(data?.items ?? []);
  const row = React.useMemo(() => {
    if (Array.isArray(data?.items)) {
      rowRef.current = data.items;
    }
    return rowRef.current;
  }, [data?.items]);
  const rowCountRef = React.useRef(data?.totalCount ?? 0);
  const rowCount = React.useMemo(() => {
    if (data?.totalCount !== undefined) {
      rowCountRef.current = data.totalCount;
    }
    return rowCountRef.current;
  }, [data?.totalCount]);
  // Handle pagination model change
  const onPaginationModelChange = useCallback(
    (newPaginationModel: GridPaginationModel) => {
      setPaginationModel(newPaginationModel);
    },
    []
  );

  const onSortModelChange = useCallback((newSortModel: GridSortModel) => {
    setSortModel(newSortModel);
  }, []);
  return (
    <Box height={height} width={"100%"}>
      <DataGrid
        rows={row}
        rowCount={rowCount}
        columns={gridColumn}
        checkboxSelection={checkboxSelection}
        paginationMode="server"
        paginationModel={paginationModel}
        onPaginationModelChange={onPaginationModelChange}
        sortingMode="server"
        sortModel={sortModel}
        onSortModelChange={onSortModelChange}
        rowSelectionModel={rowSelectionModel}
        onRowSelectionModelChange={setRowSelectionModel}
        disableColumnMenu
        loading={isValidating}
        slots={{
          pagination: (props) => (
            <CustomDataGridPagination
              isLoading={isValidating}
              refreshGrid={() => mutate()}
              {...props}
            />
          ),
          noRowsOverlay: error
            ? () => (
                <ErrorOverlay message={"Lỗi tải dữ liệu: " + error.message} />
              )
            : NoRowOverlay,
          noResultsOverlay: NoRowOverlay,
        }}
        slotProps={{
          loadingOverlay: {
            variant: "circular-progress",
          },
        }}
        getRowHeight={() => "auto"}
        density={density}
        showCellVerticalBorder
        showColumnVerticalBorder
        sx={(theme) => ({
          backgroundColor: theme.palette.background.paper,
          "& .MuiDataGrid-columnHeader": {
            backgroundColor: alpha(theme.palette.background.paper, 0.3),
          },
          "& .MuiDataGrid-cell:focus": {
            outline: "none",
          },
          "& .MuiDataGrid-cell": {
            display: "flex",
            alignItems: "center",
            px: 1,
          },
          "&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell": { py: "8px" },
          "&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell": {
            py: "15px",
          },
          "&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell": {
            py: "22px",
          },
          "& .MuiDataGrid-selectedRowCount": {
            display: "none",
          }
        })}
      />
    </Box>
  );
}

export default forwardRef(DataTable);
