import { UserResponse } from "@/types";
import { DataTableColumn } from "mantine-datatable";
import { UserDataTableAction } from "./UserDataTableAction";

export const userDataTableColumns: DataTableColumn<UserResponse>[] = [
  {
    accessor: "userName",
    title: "Tài khoản",
    width: 120,
  },
  {
    accessor: "fullName",
    title: "Họ và tên",
    width: 200,
  },
  {
    accessor: "email",
    title: "Email",
    width: 200,
  },
  {
    accessor: "phoneNumber",
    title: "Số điện thoại",
    width: 120,
  },
  {
    accessor: "role",
    title: "Vai trò",
    width: 150,
  },
  {
    accessor: "isLocked",
    title: "Trạng thái",
    width: 150,
    render: (record) => {
      return record.isLocked ? "Đã bị khóa" : "Hoạt động";
    },
  },
  {
    accessor: "action",
    title: "Hành động",
    width: 100,
    textAlign: "center",
    render: UserDataTableAction,
  },
];
