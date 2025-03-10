import { ProductResponse } from "@/types";
import { GridColDef } from "@mui/x-data-grid";
import ProductImageRenderer from "./ProductImageRenderer";
import { formatNumberWithSeperator } from "@/lib/utils";

export const productGridColumns: GridColDef<ProductResponse>[] = [
  {
    field: "imageUrls",
    headerName: "Ảnh",
    renderCell: ProductImageRenderer,
    width: 150,
    align: "center",
    headerAlign: "center",
    sortable: false,
  },
  {
    field: "sku",
    headerName: "Mã sản phẩm",
    width: 200,
  },
  {
    field: "name",
    headerName: "Tên sản phẩm",
    flex: 1,
    minWidth: 200,
  },
  {
    field: "price",
    headerName: "Giá (VNĐ)",
    width: 150,
    align: "right",
    headerAlign: "right",
    renderCell: (params) => {
      return formatNumberWithSeperator(params.value as number);
    },
  },
  {
    field: "discountPrice",
    headerName: "Giá khuyến mãi (VNĐ)",
    width: 150,
    align: "right",
    headerAlign: "right",
    renderCell: (params) => {
      return params.value
        ? formatNumberWithSeperator(params.value as number)
        : "";
    },
    sortable: false,
  },
  {
    field: "stock",
    headerName: "Số lượng",
    width: 150,
    align: "right",
    headerAlign: "right",
  },
  {
    field: "brand",
    headerName: "Thương hiệu",
    width: 150,
    sortable: false,
  },
  {
    field: "category",
    headerName: "Danh mục",
    width: 150,
    sortable: false,
  },
];
