import {
  formatDate,
  formatNumberWithSeperator,
  mapOrderStatus,
} from "@/lib/utils";
import { OrderResponse } from "@/types";
import { ActionIcon, Group } from "@mantine/core";
import { Eye, Printer } from "lucide-react";
import { DataTableColumn } from "mantine-datatable";
import Link from "next/link";

export function createOrderHistoryColumns(
  onPrint: (id: string, trackingNumber: string) => void
): DataTableColumn<OrderResponse>[] {
  return [
    {
      accessor: "trackingNumber",
      title: "Mã đơn hàng",
      width: 220,
    },
    {
      accessor: "name",
      title: "Tên khách hàng",
      width: 180,
    },
    {
      accessor: "createdDate",
      title: "Ngày đặt hàng",
      width: 150,
      textAlign: "center",
      render: (record) => formatDate(record.createdDate),
    },
    {
      accessor: "totalPrice",
      title: "Thành tiền",
      width: 150,
      textAlign: "right",
      render: (record) => formatNumberWithSeperator(record.totalPrice) + "₫",
    },
    {
      accessor: "status",
      title: "Trạng thái",
      width: 150,
      textAlign: "center",
      render: (record) => mapOrderStatus(record.status),
    },
    {
      accessor: "deliveryDate",
      title: "Ngày giao hàng",
      width: 150,
      textAlign: "center",
      render: (record) => record.deliveryDate ? formatDate(record.deliveryDate) : "Chưa giao",
    },
    {
      accessor: "action",
      title: "Hành động",
      width: 150,
      textAlign: "center",
      render: (record) => (
        <Group gap={8} justify="center">
          <ActionIcon variant="transparent" color="dark" size="sm">
            <Link href={`/orders/${record.id}`}>
              <Eye />
            </Link>
          </ActionIcon>
          <ActionIcon
            variant="transparent"
            color="dark"
            size="sm"
            onClick={() => onPrint(record.id, record.trackingNumber)}
          >
            <Printer />
          </ActionIcon>
        </Group>
      ),
    },
  ];
}
