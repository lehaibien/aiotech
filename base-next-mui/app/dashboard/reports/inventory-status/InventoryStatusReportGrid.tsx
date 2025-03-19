"use client";

import CustomDataGrid from "@/components/core/CustomDataGrid";
import { DataTableRef } from "@/components/core/DataTable";
import { API_URL } from "@/constant/apiUrl";
import { getListApi } from "@/lib/apiClient";
import { InventoryStatusReportResponse, PaginatedList } from "@/types";
import { GridColDef } from "@mui/x-data-grid";
import { UUID } from "crypto";
import { useCallback, useEffect, useRef } from "react";

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

  const fetcher = useCallback(
    async (
      page: number,
      pageSize: number
    ): Promise<PaginatedList<InventoryStatusReportResponse>> => {
      const request = {
        pageIndex: page,
        pageSize: pageSize,
        brandId: brandId,
        categoryId: categoryId,
      };
      const response = await getListApi(API_URL.outOfStockReport, request);
      if (response.success) {
        return response.data as PaginatedList<InventoryStatusReportResponse>;
      }
      throw new Error(response.message);
    },
    [brandId, categoryId]
  );
  useEffect(() => {
    if (dataGridRef.current) {
      dataGridRef.current.reload();
    }
  }, [brandId, categoryId]);
  return (
    <CustomDataGrid
      loadData={fetcher}
      checkboxSelection={false}
      ref={dataGridRef}
      columns={columns}
      withRowNumber
    />
  );
}
