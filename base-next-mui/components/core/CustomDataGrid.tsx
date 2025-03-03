'use client';

import NoRowOverlay from '@/components/core/NoRowOverlay';
import { PaginatedList } from '@/types';
import { Box } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridDensity,
  GridPaginationModel,
  GridRowSelectionModel,
} from '@mui/x-data-grid';
import { usePathname } from 'next/navigation';
import React, { useImperativeHandle } from 'react';
import useColumns from '../../hooks/useColumns';
import useDataGridData from '../../hooks/useGridData';
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
  ref: React.ForwardedRef<CustomDataGridRef>
) {
  useImperativeHandle(ref, () => ({
    rowSelectionModel: rowSelectionModel,
    reload: () => mutate(),
    clearSelection: () => setRowSelectionModel([]),
  }));

  const pathName = usePathname();
  const [paginationModel, setPaginationModel] =
    React.useState<GridPaginationModel>({
      page: 0,
      pageSize: 10,
    });
  const [rowSelectionModel, setRowSelectionModel] =
    React.useState<GridRowSelectionModel>([]);

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
  const rowRef = React.useRef(data?.items ?? []);
  const row = React.useMemo(() => {
    if (Array.isArray(data?.items) && data?.items.length > 0) {
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
  const onPaginationModelChange = React.useCallback(
    (newPaginationModel: GridPaginationModel) => {
      setPaginationModel(newPaginationModel);
    },
    []
  );

  return (
    <Box height={height} width={'100%'}>
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
            variant: 'circular-progress',
          },
        }}
        getRowHeight={() => 'auto'}
        density={density}
        showCellVerticalBorder
        sx={(theme) => ({
          '& .MuiDataGrid-cell': {
            display: 'flex',
            alignItems: 'center',
            px: 1,
          },
          '& .MuiDataGrid-iconSeparator': {
            color: theme.palette.divider,
          },
          '&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell': { py: '8px' },
          '&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell': {
            py: '15px',
          },
          '&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell': {
            py: '22px',
          },
        })}
      />
    </Box>
  );
}

export default React.forwardRef(CustomDataGrid);
