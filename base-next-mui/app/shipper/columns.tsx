import {
  formatDateFromString,
  formatNumberWithSeperator,
  mapOrderStatus,
} from "@/lib/utils";
import { OrderResponse } from "@/types";
import { Button } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import DoneIcon from "@mui/icons-material/Done";

export const createShipperColumns = (
  onMarkAsDelivered: (id: string) => void
): GridColDef<OrderResponse>[] => [
  {
    field: "trackingNumber",
    headerName: "Mã đơn hàng",
    width: 200,
  },
  {
    field: "name",
    headerName: "Tên khách hàng",
    width: 150,
  },
  {
    field: "phoneNumber",
    headerName: "Số điện thoại",
    width: 150,
  },
  {
    field: "address",
    headerName: "Địa chỉ",
    width: 250,
  },
  {
    field: "createdDate",
    headerName: "Thời gian đặt hàng",
    width: 180,
    headerAlign: "center",
    align: "center",
    valueFormatter: (params) => formatDateFromString(params),
  },
  {
    field: "totalPrice",
    headerName: "Tổng tiền",
    width: 150,
    headerAlign: "right",
    align: "right",
    valueFormatter: (params) => formatNumberWithSeperator(params as number),
  },
  {
    field: "status",
    headerName: "Trạng thái",
    width: 150,
    headerAlign: "center",
    align: "center",
    valueFormatter: (params) => mapOrderStatus(params as string),
  },
  {
    field: "actions",
    headerName: "Thao tác",
    width: 150,
    headerAlign: "center",
    align: "center",
    renderCell: (params) =>
      params.row.status === "Delivered" ? null : (
        <Button
          variant="contained"
          color="success"
          size="small"
          startIcon={<DoneIcon />}
          onClick={() => onMarkAsDelivered(params.row.id)}
        >
          Đã giao
        </Button>
      ),
  },
];
