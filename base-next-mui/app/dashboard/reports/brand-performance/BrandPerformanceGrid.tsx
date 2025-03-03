"use client";

import {DataGridPaginationPure} from "@/components/core/CustomDataGridPaginationPure";
import NoRowOverlay from "@/components/core/NoRowOverlay";
import { formatNumberWithSeperator } from "@/lib/utils";
import { BrandPerformanceReportResponse } from "@/types";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

const columns: GridColDef<BrandPerformanceReportResponse>[] = [
  {
    field: "brandName",
    headerName: "Danh mục",
    flex: 1,
    minWidth: 300,
  },
  {
    field: "productCount",
    headerName: "Số lượng sản phẩm",
    width: 250,
    valueFormatter: (params) => formatNumberWithSeperator(params as number),
  },
  {
    field: "totalRevenue",
    headerName: "Doanh thu",
    width: 250,
    valueFormatter: (params) => formatNumberWithSeperator(params as number),
  },
  {
    field: "totalUnitsSold",
    headerName: "Số lượng bán ra",
    width: 200,
    valueFormatter: (params) => formatNumberWithSeperator(params as number),
  },
  {
    field: "averageRating",
    headerName: "Đánh giá trung bình",
    width: 200,
    valueFormatter: (params) => (params as number).toFixed(1),
  },
];

type BrandPerformanceGridProps = {
  data: BrandPerformanceReportResponse[];
};

export function BrandPerformanceGrid({
  data,
}: BrandPerformanceGridProps) {
  return (
    <DataGrid
      rows={data}
      columns={columns}
      getRowId={(row) => row.brandId}
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
          sortModel: [{ field: "totalRevenue", sort: "desc" }],
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
