"use client";

import CustomDataGrid, { CustomDataGridRef } from "@/components/core/CustomDataGrid";
import { API_URL } from "@/constant/apiUrl";
import { getListApi } from "@/lib/apiClient";
import { formatNumberWithSeperator } from "@/lib/utils";
import { OutOfStockReportRequest, OutOfStockReportResponse, PaginatedList } from "@/types";
import { GridColDef } from "@mui/x-data-grid";
import { UUID } from "crypto";
import { useCallback, useEffect, useRef } from "react";

const columns: GridColDef<OutOfStockReportResponse>[] = [
  {
    field: "sku",
    headerName: "Mã sản phẩm",
    width: 130,
  },
  {
    field: "name",
    headerName: "Tên sản phẩm",
    flex: 1,
    minWidth: 250,
  },
  {
    field: "stock",
    headerName: "Tồn kho",
    width: 100,
    valueFormatter: (value) => formatNumberWithSeperator(value),
  },
  {
    field: "category",
    headerName: "Danh mục",
    width: 150,
  },
  {
    field: "brand",
    headerName: "Thương hiệu",
    width: 150,
  },
];

type OutOfStockReportGridProps = {
  brandId?: UUID;
  categoryId?: UUID;
};

export default function OutOfStockReportGrid({
  brandId,
  categoryId,
}: OutOfStockReportGridProps) {
  const dataGridRef = useRef<CustomDataGridRef>(null);
  const loadData = useCallback(
    async (
      page: number,
      pageSize: number
    ): Promise<PaginatedList<OutOfStockReportResponse>> => {
      const request: OutOfStockReportRequest = {
        pageIndex: page,
        pageSize: pageSize,
        brandId: brandId ?? undefined,
        categoryId: categoryId ?? undefined,
      };
      const response = await getListApi(API_URL.outOfStockReport, request);
      if (response.success) {
        const paginatedList = response.data as PaginatedList<OutOfStockReportResponse>;
        return paginatedList;
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
  return <CustomDataGrid ref={dataGridRef} columns={columns} loadData={loadData} withRowNumber />;
}
