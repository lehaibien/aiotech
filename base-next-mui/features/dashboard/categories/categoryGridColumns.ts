import { formatDateFromString } from "@/lib/utils";
import { CategoryResponse } from "@/types";
import { GridColDef } from "@mui/x-data-grid";
import { CategoryImageRender } from "./CategoryImageRender";

export const categoryGridColumns: GridColDef<CategoryResponse>[] = [
  {
    field: "imageUrl",
    headerName: "Hình ảnh",
    width: 200,
    align: "center",
    renderCell: CategoryImageRender,
    sortable: false,
  },
  { field: "name", headerName: "Tên danh mục", flex: 1 },
  {
    field: "createdDate",
    headerName: "Ngày tạo",
    width: 200,
    align: "center",
    valueFormatter: (params) => formatDateFromString(params as string),
  },
  {
    field: "updatedDate",
    headerName: "Ngày cập nhật",
    width: 200,
    align: "center",
    valueFormatter: (params) => formatDateFromString(params as string),
  },
];
