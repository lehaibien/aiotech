import {
  formatDate,
  formatNumberWithSeperator,
  mapOrderStatus,
} from "@/lib/utils";
import { OrderResponse } from "@/types";
import { DataTableColumn } from "mantine-datatable";
import { OrderDataTableAction } from "./OrderDataTableAction";

export const orderDataTableColumns: DataTableColumn<OrderResponse>[] = [
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
    render: (record) => mapOrderStatus(record.status),
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
    accessor: "action",
    title: "Hành động",
    width: 150,
    render: OrderDataTableAction,
  },
];
