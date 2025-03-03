import {
  formatDateFromString,
  formatNumberWithSeperator,
  mapOrderStatus,
} from "@/lib/utils";
import { OrderResponse, OrderStatus } from "@/types";
import { MenuItem, Select } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";

export const createColumns = (
  onUpdateStatus: (id: string, status: string) => void
): GridColDef<OrderResponse>[] => [
  {
    field: "trackingNumber",
    headerName: "Mã đơn hàng",
    width: 200,
  },
  {
    field: "name",
    headerName: "Khách hàng",
    width: 150,
  },
  {
    field: "createdDate",
    headerName: "Thời gian đặt hàng",
    width: 200,
    headerAlign: "center",
    align: "center",
    valueFormatter: (params) => formatDateFromString(params),
  },
  {
    field: "totalPrice",
    headerName: "Tổng tiền",
    flex: 1,
    minWidth: 200,
    headerAlign: "right",
    align: "right",
    valueFormatter: (params) => formatNumberWithSeperator(params as number),
  },
  {
    field: "status",
    headerName: "Trạng thái",
    width: 200,
    headerAlign: "center",
    align: "center",
    renderCell: (params) => {
      if (params.value === "Completed" || params.value === "Cancelled") {
        return mapOrderStatus(params.value);
      }
      return (
        <>
          <Select
            value={params.value}
            onChange={(e) => onUpdateStatus(params.row.id, e.target.value)}
            size="small"
          >
            {Object.keys(OrderStatus)
              .filter((key) => isNaN(Number(key))) // Filter out numeric keys
              .filter((key) => key != "Completed" && key != "Cancelled")
              .map((status) => (
                <MenuItem key={status} value={status}>
                  {mapOrderStatus(status)}
                </MenuItem>
              ))}
          </Select>
        </>
      );
    },
  },
  {
    field: "deliveryDate",
    headerName: "Ngày giao hàng",
    width: 200,
    headerAlign: "center",
    align: "center",
    valueFormatter: (params) => formatDateFromString(params),
  },
  {
    field: "paymentProvider",
    headerName: "Đơn vị thanh toán",
    width: 150,
  },
];

// export const columns: GridColDef<OrderResponse>[] = [
//   {
//     field: "trackingNumber",
//     headerName: "Mã đơn hàng",
//     width: 200,
//   },
//   {
//     field: "name",
//     headerName: "Tên khách hàng",
//     width: 150,
//   },
//   {
//     field: "createdDate",
//     headerName: "Thời gian đặt hàng",
//     width: 200,
//     headerAlign: "center",
//     align: "center",
//     valueFormatter: (params) => formatDateFromString(params),
//   },
//   {
//     field: "totalPrice",
//     headerName: "Tổng tiền",
//     flex: 1,
//     headerAlign: "right",
//     align: "right",
//     valueFormatter: (params) => formatNumberWithSeperator(params as number),
//   },
//   {
//     field: "status",
//     headerName: "Trạng thái",
//     width: 200,
//     headerAlign: "center",
//     align: "center",
//     valueFormatter: (params) => mapOrderStatus(params as string),
//   },
//   {
//     field: "shippedDate",
//     headerName: "Ngày giao hàng",
//     width: 200,
//     headerAlign: "center",
//     align: "center",
//     valueFormatter: (params) => formatDateFromString(params),
//   },
//   {
//     field: "paymentProvider",
//     headerName: "Đơn vị thanh toán",
//     width: 150,
//   },
// ];
