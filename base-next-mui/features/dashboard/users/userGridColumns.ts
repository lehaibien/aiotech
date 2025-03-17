import { UserResponse } from "@/types";
import { GridColDef } from "@mui/x-data-grid";

export const userGridColumns: GridColDef<UserResponse>[] = [
  { field: "userName", headerName: "Tên tài khoản", flex: 1, minWidth: 150 },
  { field: "fullName", headerName: "Họ và tên", flex: 1, minWidth: 200 },
  { field: "email", headerName: "Email", width: 300 },
  { field: "phoneNumber", headerName: "Số điện thoại", width: 150 },
  { field: "role", headerName: "Vai trò", width: 150 },
  {
    field: "isLocked",
    headerName: "Trạng thái",
    width: 150,
    renderCell: (params) => {
      return params.value ? "Đã bị khóa" : "Hoạt động";
    },
  },
];
