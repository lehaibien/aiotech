"use client";

import DataTable, { DataTableRef } from "@/components/core/DataTable";
import { API_URL } from "@/constant/apiUrl";
import { formatNumberWithSeperator } from "@/lib/utils";
import { InventoryStatusReportResponse } from "@/types";
import { GridColDef } from "@mui/x-data-grid";
import { UUID } from "crypto";
import { useEffect, useRef } from "react";

const columns: GridColDef<InventoryStatusReportResponse>[] = [
  {
    field: "sku",
    headerName: "Mã sản phẩm",
    width: 130,
    sortable: false,
  },
  {
    field: "name",
    headerName: "Tên sản phẩm",
    flex: 1,
    minWidth: 250,
    sortable: false,
  },
  {
    field: "currentStock",
    headerName: "Tồn kho",
    width: 100,
    sortable: false,
    valueFormatter: (value) => formatNumberWithSeperator(value),
  },
  {
    field: "stockStatus",
    headerName: "Tình trạng",
    width: 150,
    sortable: false,
    valueFormatter: (value) => {
      if (value === "Out of Stock") {
        return "Hết hàng";
      }
      if (value === "Low Stock") {
        return "Sắp hết hàng";
      }
      return "Còn hàng";
    },
  },
  {
    field: "reorderRecommended",
    headerName: "Cần đặt hàng",
    width: 150,
    sortable: false,
    valueFormatter: (value: boolean) => {
      return value ? "Có" : "Không";
    },
  },
  {
    field: "category",
    headerName: "Danh mục",
    width: 200,
    sortable: false,
  },
  {
    field: "brand",
    headerName: "Thương hiệu",
    width: 200,
    sortable: false,
  },
];

type InventoryStatusReportGridProps = {
  brandId?: UUID;
  categoryId?: UUID;
};

export default function InventoryStatusReportGrid({
  brandId,
  categoryId,
}: InventoryStatusReportGridProps) {
  const dataGridRef = useRef<DataTableRef>(null);

  useEffect(() => {
    if (dataGridRef.current) {
      dataGridRef.current.reload();
    }
  }, [brandId, categoryId]);
  return (
    <DataTable
      apiUrl={API_URL.outOfStockReport}
      checkboxSelection={false}
      ref={dataGridRef}
      columns={columns}
      withRowNumber
    />
  );
}
