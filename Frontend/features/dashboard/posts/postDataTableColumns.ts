import { formatDate } from "@/lib/utils";
import { PostResponse } from "@/types";
import { DataTableColumn } from "mantine-datatable";
import { PostDataTableAction } from "./PostDataTableAction";
import { PostImageRender } from "./PostImageRender";

export const postDataTableColumns: DataTableColumn<PostResponse>[] = [
  {
    accessor: "imageUrl",
    title: "Ảnh",
    width: 200,
    textAlign: "center",
    render: PostImageRender,
  },
  {
    accessor: "title",
    title: "Tên bài viết",
    width: 200,
  },
  {
    accessor: "createdDate",
    title: "Ngày tạo",
    width: 150,
    render: (record) => formatDate(record.createdDate),
  },
  {
    accessor: "updatedDate",
    title: "Ngày cập nhật",
    width: 150,
    render: (record) =>
      record.updatedDate ? formatDate(record.updatedDate) : null,
  },
  {
    accessor: "action",
    title: "Hành động",
    width: 80,
    textAlign: "center",
    render: PostDataTableAction,
  },
];
