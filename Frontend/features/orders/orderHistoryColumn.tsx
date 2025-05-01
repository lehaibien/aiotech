import {
  formatDateFromString,
  formatNumberWithSeperator,
  mapOrderStatus,
} from "@/lib/utils";
import { OrderResponse } from "@/types";
import { ActionIcon, Group } from "@mantine/core";
import { GridColDef } from "@mui/x-data-grid";
import { Eye, Printer } from "lucide-react";
import Link from "next/link";

export function createOrderHistoryColumns(
  onPrint: (id: string, trackingNumber: string) => void
): GridColDef<OrderResponse>[] {
  return [
    {
      field: "trackingNumber",
      headerName: "Mã đơn hàng",
      width: 250,
    },
    {
      field: "name",
      headerName: "Tên khách hàng",
      width: 200,
    },
    {
      field: "createdDate",
      headerName: "Ngày đặt hàng",
      width: 200,
      headerAlign: "center",
      align: "center",
      valueFormatter: (params) => formatDateFromString(params),
    },
    {
      field: "totalPrice",
      headerName: "Thành tiền",
      flex: 1,
      headerAlign: "right",
      align: "right",
      valueFormatter: (params) => formatNumberWithSeperator(params),
    },
    {
      field: "status",
      headerName: "Trạng thái",
      width: 200,
      headerAlign: "center",
      align: "center",
      valueFormatter: (params) => mapOrderStatus(params),
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
      field: "action",
      headerName: "Hành động",
      width: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Group gap={8}>
          <ActionIcon variant="transparent" color="dark" size="sm">
            <Link href={`/orders/${params.row.id}`}>
              <Eye />
            </Link>
          </ActionIcon>
          <ActionIcon
            variant="transparent"
            color="dark"
            size="sm"
            onClick={() => onPrint(params.row.id, params.row.trackingNumber)}
          >
            <Printer />
          </ActionIcon>
        </Group>
      ),
    },
  ];
}
