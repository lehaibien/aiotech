import { formatDate } from "@/lib/utils";
import { CategoryResponse } from "@/types";
import { DataTableColumn } from "mantine-datatable";
import { CategoryDataTableAction } from "./CategoryDataTableAction";
import { CategoryImageRender } from "./CategoryImageRender";

export const categoryDataTableColumns: DataTableColumn<CategoryResponse>[] = [
  {
    accessor: "imageUrl",
    title: "Ảnh",
    width: 150,
    textAlign: "center",
    render: CategoryImageRender,
  },
  {
    accessor: "name",
    title: "Tên danh mục",
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
    sortable: true,
  },
  {
    accessor: "action",
    title: "Hành động",
    width: 80,
    textAlign: "center",
    render: CategoryDataTableAction,
  },
];
