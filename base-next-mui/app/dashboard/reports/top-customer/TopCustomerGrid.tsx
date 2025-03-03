"use client";

import { formatNumberWithSeperator } from "@/lib/utils";
import { TopCustomerReportResponse } from "@/types/report";
import { Card, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

type TopCustomerGridProps = {
  data: TopCustomerReportResponse[];
};

export default function TopCustomerGrid({ data }: TopCustomerGridProps) {
  const columns: GridColDef[] = [
    { field: "customerName", headerName: "Tên khách hàng", width: 200 },
    {
      field: "orderCount",
      headerName: "Tổng số đơn hàng",
      width: 150,
      type: "number",
    },
    {
      field: "totalSpent",
      headerName: "Tổng tiền đã chi",
      width: 250,
      type: "number",
      valueFormatter: (params) => {
        return formatNumberWithSeperator(params as number);
      },
    },
    {
      field: "averageOrderValue",
      headerName: "Giá trị trung bình mỗi đơn hàng",
      width: 250,
      type: "number",
      valueFormatter: (params) => {
        return formatNumberWithSeperator(params as number);
      },
    },
    {
      field: "daysSinceLastPurchase",
      headerName: "Ngày kể từ lần mua cuối",
      width: 200,
      type: "number",
    },
    {
      field: "frequentlyPurchasedCategories",
      headerName: "Danh mục thường mua",
      flex: 1,
      minWidth: 300,
      valueFormatter: (params) => (params as string[]).join(", "),
    },
  ];

  return (
    <Card variant="outlined" sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Top khách hàng
      </Typography>
      <DataGrid
        rows={data}
        columns={columns}
        getRowId={(row) => row.customerId}
        initialState={{
          sorting: {
            sortModel: [{ field: "totalSpent", sort: "desc" }],
          },
        }}
        autoHeight
        pageSizeOptions={[10, 25, 50]}
      />
    </Card>
  );
}
