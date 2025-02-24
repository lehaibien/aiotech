import { UserResponse } from '@/types';
import { GridColDef } from '@mui/x-data-grid';

export const columns: GridColDef<UserResponse>[] = [
  { field: 'userName', headerName: 'Tên tài khoản', flex: 1 },
  { field: 'fullName', headerName: 'Họ và tên', flex: 1 },
  { field: 'email', headerName: 'Email', flex: 1 },
  { field: 'phoneNumber', headerName: 'Số điện thoại', flex: 1 },
  { field: 'role', headerName: 'Vai trò', flex: 1 },
];
