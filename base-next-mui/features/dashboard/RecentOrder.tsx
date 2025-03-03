"use client";

import NoRowOverlay from "@/components/core/NoRowOverlay";
import { OrderResponse } from "@/types";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

const columns: GridColDef<OrderResponse>[] = [
  {
    field: "trackingNumber",
    headerName: "Mã đơn hàng",
    width: 200,
    align: "center",
  },
  { field: "customerName", headerName: "Khách hàng", flex: 1, minWidth: 200 },
  {
    field: "phoneNumber",
    headerName: "Số điện thoại",
    width: 150,
    align: "center",
  },
  {
    field: "createdDate",
    headerName: "Ngày đặt hàng",
    width: 150,
    align: "center",
  },
  { field: "totalPrice", headerName: "Thành tiền", width: 120, type: "number" },
];

type RecentOrdersProps = {
  data: OrderResponse[];
};

export function RecentOrders({ data }: RecentOrdersProps) {
  return (
    <DataGrid
      rows={data}
      columns={columns}
      pageSizeOptions={[10]}
      slots={{
        noRowsOverlay: NoRowOverlay,
        noResultsOverlay: NoRowOverlay,
        pagination: () => null,
      }}
    />
  );
}
