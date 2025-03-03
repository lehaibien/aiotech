"use client";

import { DataGridPaginationPure } from "@/components/core/CustomDataGridPaginationPure";
import NoRowOverlay from "@/components/core/NoRowOverlay";
import { Box, Rating } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { ProductRatingReportResponse } from "@/types";

const columns: GridColDef<ProductRatingReportResponse>[] = [
  {
    field: "productName",
    headerName: "Tên sản phẩm",
    flex: 1,
    minWidth: 300,
  },
  {
    field: "averageRating",
    headerName: "Đánh giá trung bình",
    width: 200,
    renderCell: (params) => (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Rating value={params.value} readOnly precision={0.1} />
        <span>({params.value.toFixed(1)})</span>
      </Box>
    ),
  },
  {
    field: "reviewCount",
    headerName: "Số lượng đánh giá",
    width: 200,
  },
  {
    field: "positiveSentimentPercentage",
    headerName: "Tỷ lệ tích cực",
    width: 150,
    valueFormatter: (params) => `${(params as number).toFixed(2)}%`,
  },
  {
    field: "negativeSentimentPercentage",
    headerName: "Tỷ lệ tiêu cực",
    width: 150,
    valueFormatter: (params) => `${(params as number).toFixed(2)}%`,
  },
];

type ProductRatingGridProps = {
  data: ProductRatingReportResponse[];
};

export function ProductRatingGrid({ data }: ProductRatingGridProps) {
  return (
    <DataGrid
      rows={data}
      columns={columns}
      getRowId={(row) => row.productId}
      disableRowSelectionOnClick
      showCellVerticalBorder
      showColumnVerticalBorder
      pageSizeOptions={[10, 25, 50]}
      initialState={{
        pagination: {
          paginationModel: {
            pageSize: 10,
          },
        },
        sorting: {
          sortModel: [{ field: "averageRating", sort: "desc" }],
        },
      }}
      slots={{
        pagination: DataGridPaginationPure,
        noRowsOverlay: NoRowOverlay,
        noResultsOverlay: NoRowOverlay,
      }}
    />
  );
}
