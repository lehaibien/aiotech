import { formatNumberWithSeperator } from "@/lib/utils";
import { ProductResponse } from "@/types";
import { DataTableColumn } from "mantine-datatable";
import { ProductImageRender } from "./ProductImageRender";
import { ProductDataTableAction } from "./ProductDataTableAction";

export const productDataTableColumns: DataTableColumn<ProductResponse>[] = [
  {
    accessor: "imageUrls",
    title: "Ảnh",
    width: 200,
    textAlign: "center",
    render: ProductImageRender,
  },
  {
    accessor: "sku",
    title: "Mã sản phẩm",
    width: 150,
    sortable: true,
  },
  {
    accessor: "name",
    title: "Tên sản phẩm",
    width: 200,
    sortable: true,
  },
  {
    accessor: "price",
    title: "Giá",
    width: 180,
    render: (record) => formatNumberWithSeperator(record.price) + "đ",
    sortable: true,
  },
  {
    accessor: "discountPrice",
    title: "Giá khuyến mãi",
    width: 180,
    render: (record) =>
      record.discountPrice
        ? `${formatNumberWithSeperator(record.discountPrice)}đ`
        : "",
    sortable: true,
  },
  {
    accessor: "stock",
    title: "Tồn kho",
    width: 100,
    sortable: true,
  },
  {
    accessor: "brand",
    title: "Thương hiệu",
    width: 120,
  },
  {
    accessor: "category",
    title: "Danh mục",
    width: 120,
  },
  {
    accessor: "action",
    title: "Hành động",
    width: 120,
    textAlign: "center",
    render: ProductDataTableAction,
  },
];
