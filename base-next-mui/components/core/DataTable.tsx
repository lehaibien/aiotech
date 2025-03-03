'use client';

import NoRowOverlay from '@/components/core/NoRowOverlay';
import { useDataTableFetch } from '@/hooks/useDataTableFetch';
import { PaginatedList } from '@/types';
import { Box } from '@mui/material';
import {
    DataGrid,
    GridColDef,
    GridDensity,
    GridPaginationModel,
    GridRowSelectionModel,
    GridSortModel,
} from '@mui/x-data-grid';
import React, { ForwardedRef, forwardRef, useCallback, useImperativeHandle, useState } from 'react';
import useColumns from '../../hooks/useColumns';
import ErrorOverlay from './ErrorOverlay';
import CustomDataGridPagination from './CustomDataGridPagination';

export type DataTableProps<T> = {
  columns: GridColDef[];
  apiUrl: string;
  checkboxSelection?: boolean;
  withRowNumber?: boolean;
  height?: number;
  density?: GridDensity;
  loadData: (page: number, pageSize: number, sort: GridSortModel) => Promise<PaginatedList<T>>;
};

export type DataTableRef = {
  rowSelectionModel: GridRowSelectionModel;
  reload: () => void;
  clearSelection: () => void;
};

function DataTable<T>(
  {
    columns,
    apiUrl,
    checkboxSelection,
    withRowNumber,
    height = 600,
    density = 'standard',
  }: DataTableProps<T>,
  ref: ForwardedRef<DataTableRef>
) {
  useImperativeHandle(ref, () => ({
    rowSelectionModel: rowSelectionModel,
    reload: () => mutate(),
    clearSelection: () => setRowSelectionModel([]),
  }));

  const [paginationModel, setPaginationModel] =
    useState<GridPaginationModel>({
      page: 0,
      pageSize: 10,
    });
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  
  const [globalFilter, setGlobalFilter] = useState('');
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
    sortModel: []
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
  const onPaginationModelChange = useCallback(
    (newPaginationModel: GridPaginationModel) => {
      setPaginationModel(newPaginationModel);
    },
    []
  );

  const onSortModelChange = useCallback(
    (newSortModel: GridSortModel) => {
      setSortModel(newSortModel);
    },
    []
  );

  const handleGlobalFilterChange = useCallback(
    (newGlobalFilter: string) => {
      setGlobalFilter(newGlobalFilter);
    },
    []
  );

  return (
    <Box height={height} width={'100%'}>
      <Box>
      <input
        type="text"
        placeholder="Search..."
        value={globalFilter}
        onChange={(e) => handleGlobalFilterChange(e.target.value)}
        style={{
          marginBottom: '10px',
          padding: '8px',
          width: '100%',
          boxSizing: 'border-box',
        }}
      />
      </Box>
      <DataGrid
        rows={row}
        rowCount={rowCount}
        columns={gridColumn}
        checkboxSelection={checkboxSelection}
        paginationMode='server'
        paginationModel={paginationModel}
        onPaginationModelChange={onPaginationModelChange}
        sortingMode='server'
        sortModel={sortModel}
        onSortModelChange={onSortModelChange}
        rowSelectionModel={rowSelectionModel}
        onRowSelectionModelChange={setRowSelectionModel}
        disableColumnSorting
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
          borderColor: theme.palette.divider,
          '& .MuiDataGrid-cell': {
            display: 'flex',
            alignItems: 'center',
            px: 1,
          },
          '& .MuiDataGrid-columnHeader': {
            padding: 0,
          },
          '& .MuiDataGrid-columnHeaderTitleContainer': {
            // justifyContent: 'center',
            px: 1,
          },
          '& .MuiDataGrid-iconSeparator': {
            color: theme.palette.divider,
          },
          '& .MuiDataGrid-footerContainer': {
            borderColor: theme.palette.divider,
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

export default forwardRef(DataTable);
