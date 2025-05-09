import { DataTableColumn } from "mantine-datatable";
import { InventoryStatusReportResponse } from "@/types";

export const inventoryStatusDataTableColumns: DataTableColumn<InventoryStatusReportResponse>[] = [
  {
    accessor: "sku",
    title: "Mã sản phẩm",
    width: 130,
  },
  {
    accessor: "name",
    title: "Tên sản phẩm",
    width: 250,
  },
  {
    accessor: "currentStock",
    title: "Tồn kho",
    width: 100,
  },
  {
    accessor: "stockStatus",
    title: "Tình trạng",
    width: 150,
    render: (record) => {
      if (record.stockStatus === "Out of Stock") {
        return "Hết hàng";
      }
      if (record.stockStatus === "Low Stock") {
        return "Sắp hết hàng";
      }
      return "Còn hàng";
    },
  },
  {
    accessor: "reorderRecommended",
    title: "Cần đặt hàng",
    width: 150,
    render: (record) => record.reorderRecommended ? "Có" : "Không",
  },
  {
    accessor: "category",
    title: "Danh mục",
    width: 200,
  },
  {
    accessor: "brand",
    title: "Thương hiệu",
    width: 200,
  },
];