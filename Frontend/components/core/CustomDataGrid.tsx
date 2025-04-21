'use client';

import NoRowOverlay from '@/components/core/NoRowOverlay';
import useColumns from '@/hooks/useColumns';
import useDataGridData from '@/hooks/useGridData';
import { PaginatedList } from '@/types';
import { alpha, Box } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridDensity,
  GridPaginationModel,
  GridRowSelectionModel,
} from '@mui/x-data-grid';
import { usePathname } from 'next/navigation';
import {
  ForwardedRef,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import DataGridPagination from './CustomDataGridPagination';
import ErrorOverlay from './ErrorOverlay';

export type CustomDataGridProps<T> = {
  columns: GridColDef[];
  checkboxSelection?: boolean;
  withRowNumber?: boolean;
  height?: number;
  density?: GridDensity;
  loadData: (page: number, pageSize: number) => Promise<PaginatedList<T>>;
};

export type CustomDataGridRef = {
  rowSelectionModel: GridRowSelectionModel;
  reload: () => void;
  clearSelection: () => void;
};

function CustomDataGrid<T>(
  {
    columns,
    checkboxSelection,
    withRowNumber,
    height = 600,
    density = 'standard',
    loadData,
  }: CustomDataGridProps<T>,
  ref: ForwardedRef<CustomDataGridRef>
) {
  useImperativeHandle(ref, () => ({
    rowSelectionModel: rowSelectionModel,
    reload: () => mutate(),
    clearSelection: () =>
      setRowSelectionModel({
        type: 'include',
        ids: new Set<string>(),
      }),
  }));

  const pathName = usePathname();
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });
  const [rowSelectionModel, setRowSelectionModel] =
    useState<GridRowSelectionModel>({
      type: 'include',
      ids: new Set<string>(),
    });

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
    return rowRef.current;
  }, [data?.items]);
  const rowCountRef = useRef(data?.totalCount ?? 0);
  const rowCount = useMemo(() => {
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

  return (
    <Box
      height={height}
      width={'100%'}>
      <DataGrid
        rows={row}
        rowCount={rowCount}
        columns={gridColumn}
        checkboxSelection={checkboxSelection}
        paginationMode='server'
        paginationModel={paginationModel}
        onPaginationModelChange={onPaginationModelChange}
        rowSelectionModel={rowSelectionModel}
        onRowSelectionModelChange={(newSelection) => {
          setRowSelectionModel?.(newSelection);
        }}
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
                <ErrorOverlay message={'Lỗi tải dữ liệu: ' + error.message} />
              )
            : NoRowOverlay,
          noResultsOverlay: NoRowOverlay,
        }}
        slotProps={{
          loadingOverlay: {
            variant: 'skeleton',
          },
        }}
        getRowHeight={() => 'auto'}
        density={density}
        showCellVerticalBorder
        sx={(theme) => ({
          '& .MuiDataGrid-columnHeader': {
            backgroundColor: alpha(theme.palette.background.paper, 0.1),
          },
          '& .MuiDataGrid-cell:focus': {
            outline: 'none',
          },
          '& .MuiDataGrid-cell': {
            display: 'flex',
            alignItems: 'center',
            px: 1,
          },
          '&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell': { py: 1 },
          '&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell': {
            py: 2,
          },
          '&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell': {
            py: 3,
          },
          '& .MuiDataGrid-selectedRowCount': {
            display: 'none',
          },
        })}
      />
    </Box>
  );
}

export default forwardRef(CustomDataGrid);
