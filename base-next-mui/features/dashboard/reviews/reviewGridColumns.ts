import { formatDateFromString } from '@/lib/utils';
import { ReviewResponse } from '@/types';
import { GridColDef } from '@mui/x-data-grid';
import ReviewRatingRenderer from './ReviewRatingRenderer';

export const reviewGridColumns: GridColDef<ReviewResponse>[] = [
  { field: 'userName', headerName: 'Tên tài khoản', width: 200 },
  { field: 'productName', headerName: 'Tên sản phẩm', width: 250 },
  {
    field: 'rating',
    headerName: 'Đánh giá',
    width: 200,
    headerAlign: 'center',
    align: 'center',
    renderCell: ReviewRatingRenderer,
  },
  {
    field: 'comment',
    headerName: 'Bình luận',
    flex: 1,
    minWidth: 250,
  },
  {
    field: 'createdDate',
    headerName: 'Thời gian thực hiện',
    width: 200,
    valueFormatter: (params) => formatDateFromString(params as string),
  },
];
