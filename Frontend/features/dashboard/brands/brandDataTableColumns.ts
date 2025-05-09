import { formatDate } from "@/lib/utils";
import { BrandResponse } from "@/types";
import { DataTableColumn } from "mantine-datatable";
import { BrandDataTableAction } from "./BrandDataTableAction";
import { BrandImageRender } from "./BrandImageRender";

export const brandDataTableColumns: DataTableColumn<BrandResponse>[] = [
  {
    accessor: "imageUrl",
    title: "Ảnh",
    width: 150,
    textAlign: "center",
    render: BrandImageRender,
  },
  {
    accessor: "name",
    title: "Tên thương hiệu",
    width: 200,
    sortable: true,
  },
  {
    accessor: "createdDate",
    title: "Ngày tạo",
    width: 200,
    render: (record) => formatDate(record.createdDate),
    sortable: true,
  },
  {
    accessor: "updatedDate",
    title: "Ngày cập nhật",
    width: 200,
    render: (record) =>
      record.updatedDate ? formatDate(record.updatedDate) : null,
  },
  {
    accessor: "action",
    title: "Hành động",
    width: 80,
    textAlign: "center",
    render: BrandDataTableAction,
  },
];
