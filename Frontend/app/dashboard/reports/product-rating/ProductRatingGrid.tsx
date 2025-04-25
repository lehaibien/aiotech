"use client";

import { DataGridPaginationPure } from "@/components/core/CustomDataGridPaginationPure";
import NoRowOverlay from "@/components/core/NoRowOverlay";
import { ProductRatingReportResponse } from "@/types";
import { alpha, Box, Rating } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

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

/**
 * Displays a data grid of product rating information with sortable columns and custom styling.
 *
 * Renders product names, average ratings (with star icons), review counts, and sentiment percentages in a paginated, sortable grid.
 *
 * @param data - Array of product rating report objects to display in the grid.
 */
export function ProductRatingGrid({ data }: ProductRatingGridProps) {
  return (
    <DataGrid
      rows={data}
      columns={columns}
      getRowId={(row) => row.productId}
      disableRowSelectionOnClick
      disableColumnMenu
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
      showCellVerticalBorder
      showColumnVerticalBorder
      sx={(theme) => ({
        "& .MuiDataGrid-columnHeader": {
          backgroundColor: alpha(theme.palette.background.paper, 0.1),
        },
        "& .MuiDataGrid-cell:focus": {
          outline: "none",
        },
        "& .MuiDataGrid-cell": {
          display: "flex",
          alignItems: "center",
          px: 1,
        },
        "&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell": { py: 1 },
        "&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell": {
          py: 2,
        },
        "&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell": {
          py: 3,
        },
        "& .MuiDataGrid-selectedRowCount": {
          display: "none",
        },
      })}
    />
  );
}
