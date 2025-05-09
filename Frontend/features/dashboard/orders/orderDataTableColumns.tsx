import {
  formatDate,
  formatNumberWithSeperator,
  mapOrderStatus,
} from "@/lib/utils";
import { OrderResponse, OrderStatus } from "@/types";
import { Select } from "@mantine/core";
import { DataTableColumn } from "mantine-datatable";

export const createOrderDataTableColumns = (
  onUpdateStatus: (id: string, status: string) => void
): DataTableColumn<OrderResponse>[] => [
  {
    accessor: "trackingNumber",
    title: "Mã đơn hàng",
    width: 200,
  },
  {
    accessor: "name",
    title: "Khách hàng",
    width: 150,
  },
  {
    accessor: "createdDate",
    title: "Thời gian đặt hàng",
    width: 200,
    textAlign: "center",
    render: (record) => formatDate(record.createdDate),
  },
  {
    accessor: "totalPrice",
    title: "Tổng tiền",
    width: 200,
    textAlign: "right",
    render: (record) =>
      formatNumberWithSeperator(Number(record.totalPrice.toFixed(2))),
  },
  {
    accessor: "status",
    title: "Trạng thái",
    width: 200,
    textAlign: "center",
    render: (record) => {
      if (record.status === "Completed" || record.status === "Cancelled") {
        return mapOrderStatus(record.status);
      }
      return (
        <Select
          value={record.status}
          onChange={(value) => onUpdateStatus(record.id, value!)}
          size="xs"
          data={Object.keys(OrderStatus)
            .filter((key) => isNaN(Number(key)))
            .filter((key) => key !== "Completed" && key !== "Cancelled")
            .map((status) => ({
              label: mapOrderStatus(status),
              value: status,
            }))}
        />
      );
    },
  },
  {
    accessor: "deliveryDate",
    title: "Ngày giao hàng",
    width: 200,
    textAlign: "center",
    render: (record) =>
      record.deliveryDate ? formatDate(record.deliveryDate) : "",
  },
  {
    accessor: "paymentProvider",
    title: "Đơn vị thanh toán",
    width: 150,
  },
];
