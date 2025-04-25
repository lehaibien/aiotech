'use client';

import { formatNumberWithSeperator } from '@/lib/utils';
import { TopCustomerReportResponse } from '@/types/report';
import { alpha } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import dayjs from '@/lib/extended-dayjs';

const columns: GridColDef[] = [
  { field: 'customerName', headerName: 'Khách hàng', width: 200 },
  {
    field: 'orderCount',
    headerName: 'Tổng số đơn',
    width: 150,
  },
  {
    field: 'totalSpent',
    headerName: 'Tổng chi',
    width: 250,
    valueFormatter: (params) => {
      return formatNumberWithSeperator(params as number);
    },
  },
  {
    field: 'averageOrderValue',
    headerName: 'Trung bình mỗi đơn hàng',
    width: 250,
    valueFormatter: (params) => {
      return formatNumberWithSeperator(params as number);
    },
  },
  {
    field: 'daysSinceLastPurchase',
    headerName: 'Lần mua cuối',
    width: 220,
    valueFormatter: (params: number) => {
      return dayjs.utc().add(params, 'day').format('DD/MM/YYYY');
    },
  },
  {
    field: 'frequentlyPurchasedCategories',
    headerName: 'Danh mục thường mua',
    flex: 1,
    minWidth: 300,
    valueFormatter: (params: string[]) => params.join(', '),
  },
];

type TopCustomerGridProps = {
  data: TopCustomerReportResponse[];
};

export default function TopCustomerGrid({ data }: TopCustomerGridProps) {
  return (
    <DataGrid
      rows={data}
      columns={columns}
      getRowId={(row) => row.customerId}
      initialState={{
        sorting: {
          sortModel: [{ field: 'totalSpent', sort: 'desc' }],
        },
      }}
      pageSizeOptions={[10, 25, 50]}
      disableColumnMenu
      disableRowSelectionOnClick
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
  );
}
