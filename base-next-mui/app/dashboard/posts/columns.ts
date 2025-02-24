import { PostResponse } from "@/types";
import { GridColDef } from "@mui/x-data-grid";
import { ImageRenderer } from "./ImageRender";
import { formatDateFromString } from "@/lib/utils";

export const columns: GridColDef<PostResponse>[] = [
  {
    field: "imageUrl",
    headerName: "Ảnh bìa",
    width: 300,
    headerAlign: "center",
    align: "center",
    renderCell: ImageRenderer,
  },
  {
    field: "title",
    headerName: "Tên bài viết",
    flex: 1,
    minWidth: 200,
  },
  {
    field: "createdDate",
    headerName: "Ngày tạo",
    width: 200,
    align: "center",
    headerAlign: "center",
    valueFormatter: (params) => formatDateFromString(params),
  },
  {
    field: "updatedDate",
    headerName: "Ngày cập nhật",
    width: 200,
    align: "center",
    headerAlign: "center",
    valueFormatter: (params) => formatDateFromString(params),
  },
  {
    field: "isPublished",
    headerName: "Trạng thái",
    width: 100,
    headerAlign: "center",
    align: "center",
    type: "boolean",
    renderCell: (params) => (params.value ? "Đã xuất bản" : "Chưa xuất bản"),
  },
];
