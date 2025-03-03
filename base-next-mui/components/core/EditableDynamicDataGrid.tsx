"use client";

import NoRowOverlay from "@/components/core/NoRowOverlay";
import { PaginatedList } from "@/types";
import { Box } from "@mui/material";
import {
    DataGrid,
    GridColDef,
    GridDensity,
    GridEventListener,
    GridPaginationModel,
    GridRowEditStopReasons,
    GridRowId,
    GridRowModel,
    GridRowModes,
    GridRowModesModel,
    GridRowSelectionModel
} from "@mui/x-data-grid";
import { usePathname } from "next/navigation";
import React, {
    forwardRef,
    useCallback,
    useImperativeHandle,
    useMemo,
    useRef,
    useState,
} from "react";
import useColumns from "../../hooks/useColumns";
import useDataGridData from "../../hooks/useGridData";
import DataGridPagination from "./CustomDataGridPagination";
import ErrorOverlay from "./ErrorOverlay";

export type EditableDynamicDataGridProps<T> = {
  columns: GridColDef[];
  checkboxSelection?: boolean;
  withRowNumber?: boolean;
  height?: number;
  density?: GridDensity;
  loadData: (page: number, pageSize: number) => Promise<PaginatedList<T>>;
  onEdit?: (id: GridRowId, field: string, value: T) => Promise<void>;
};

export type EditableDynamicDataGridRef = {
  rowSelectionModel: GridRowSelectionModel;
  editRow: (id: GridRowId) => void;
  reload: () => void;
  clearSelection: () => void;
};

function EditableDynamicDataGrid<T>(
  {
    columns,
    checkboxSelection,
    withRowNumber,
    height = 600,
    density = "standard",
    loadData,
    onEdit,
  }: EditableDynamicDataGridProps<T>,
  ref: React.ForwardedRef<EditableDynamicDataGridRef>
) {
  useImperativeHandle(ref, () => ({
    rowSelectionModel: rowSelectionModel,
    editRow: (id: GridRowId) => {
        setRowModesModel((prevRowModesModel) => ({
          ...prevRowModesModel,
          [id]: { mode: GridRowModes.Edit },
        }));
    },
    reload: () => mutate(),
    clearSelection: () => setRowSelectionModel([]),
  }));

  const pathName = usePathname();
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });
  const [rowSelectionModel, setRowSelectionModel] =
    useState<GridRowSelectionModel>([]);

  // Add row number column if needed
  const gridColumn = useColumns({
    columns: columns,
    withRowNumber: withRowNumber,
  });

  const { data, error, isValidating, mutate } = useDataGridData({
    pathName,
    paginationModel,
    loadData,
  });
  const rowRef = useRef(data?.items ?? []);
  const row = useMemo(() => {
    if (Array.isArray(data?.items) && data?.items.length > 0) {
      rowRef.current = data.items;
    }
    return rowRef.current as ReadonlyArray<GridRowModel>;
  }, [data?.items]);
  const rowCountRef = useRef(data?.totalCount ?? 0);
  const rowCount = useMemo(() => {
    if (data?.totalCount !== undefined) {
      rowCountRef.current = data.totalCount;
    }
    return rowCountRef.current;
  }, [data?.totalCount]);

  const processRowUpdate = (newRow: GridRowModel) => {
    if(onEdit) {
      onEdit(newRow.id, newRow.field, newRow.value).then(() => {
        mutate(); // Refresh data after edit
      });
    }
    return newRow;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  // Handle pagination model change
  const onPaginationModelChange = useCallback(
    (newPaginationModel: GridPaginationModel) => {
      setPaginationModel(newPaginationModel);
    },
    []
  );

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

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
        rowSelectionModel={rowSelectionModel}
        onRowSelectionModelChange={(newSelection) => {
          setRowSelectionModel?.(newSelection);
        }}
        editMode="row" // Enable cell editing
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        disableColumnSorting
        disableColumnMenu
        disableRowSelectionOnClick
        loading={isValidating}
        slots={{
          pagination: (props) => (
            <DataGridPagination
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
        sx={(theme) => ({
          // borderColor: theme.palette.divider,
          "& .MuiDataGrid-cell": {
            display: "flex",
            alignItems: "center",
            px: 1,
          },
          "& .MuiDataGrid-iconSeparator": {
            color: theme.palette.divider,
          },
          // '& .MuiDataGrid-footerContainer': {
          //   borderColor: theme.palette.divider,
          // },
          "&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell": { py: "8px" },
          "&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell": {
            py: "15px",
          },
          "&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell": {
            py: "22px",
          },
        })}
      />
    </Box>
  );
}

export default forwardRef(EditableDynamicDataGrid);
