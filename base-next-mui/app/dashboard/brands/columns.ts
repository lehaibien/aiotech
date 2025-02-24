import { formatDateFromString } from '@/lib/utils';
import { BrandResponse } from '@/types';
import { GridColDef } from '@mui/x-data-grid';
import BrandImageRenderer from './BrandImageRenderer';

export const columns: GridColDef<BrandResponse>[] = [
  {
    field: 'imageUrl',
    headerName: 'Logo',
    width: 100,
    align: 'center',
    renderCell: BrandImageRenderer,
  },
  { field: 'name', headerName: 'Tên thương hiệu', flex: 1, minWidth: 250 },
  {
    field: 'createdDate',
    headerName: 'Ngày tạo',
    width: 200,
    align: 'center',
    valueFormatter: (params) => formatDateFromString(params as string),
  },
  {
    field: 'updatedDate',
    headerName: 'Ngày cập nhật',
    width: 200,
    align: 'center',
    valueFormatter: (params) => formatDateFromString(params as string),
  },
];
