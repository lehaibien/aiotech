"use client";

import { MantineDataTable } from "@/components/data-table/MantineDataTable";
import { API_URL } from "@/constant/apiUrl";
import { EMPTY_UUID } from "@/constant/common";
import { inventoryStatusDataTableColumns } from "@/features/dashboard/reports/inventory-status/inventoryStatusDataTableColumns";
import { getListApi } from "@/lib/apiClient";
import { InventoryStatusReportResponse, PaginatedList, UUID } from "@/types";
import { useCallback, useEffect, useState } from "react";
import useSWR from "swr";

type InventoryStatusReportGridProps = {
  brandId?: UUID;
  categoryId?: UUID;
};

export const InventoryStatusReportGrid = ({
  brandId,
  categoryId,
}: InventoryStatusReportGridProps) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const fetcher = useCallback(
    async ([page, pageSize, brandId, categoryId]: [
      number,
      number,
      UUID?,
      UUID?
    ]): Promise<PaginatedList<InventoryStatusReportResponse>> => {
      const request = {
        pageIndex: page,
        pageSize: pageSize,
        brandId: brandId,
        categoryId: categoryId,
      };
      const response = await getListApi(API_URL.inventoryStatusReport, request);
      if (response.success) {
        return response.data as PaginatedList<InventoryStatusReportResponse>;
      }
      throw new Error(response.message);
    },
    []
  );
  const { data, isValidating, mutate } = useSWR<
    PaginatedList<InventoryStatusReportResponse>
  >([page - 1, pageSize, brandId, categoryId], {
    fetcher: fetcher,
    revalidateOnFocus: false,
    revalidateOnMount: true,
  });
  useEffect(() => {
    if (brandId !== EMPTY_UUID || categoryId !== EMPTY_UUID) {
      setPage(1);
      mutate();
    }
  }, [brandId, categoryId, mutate]);
  return (
    <MantineDataTable
      columns={inventoryStatusDataTableColumns}
      data={data?.items || []}
      totalRows={data?.totalCount || 0}
      loading={isValidating}
      withRowNumber
      page={page}
      onPageChange={setPage}
      pageSize={pageSize}
      onPageSizeChange={setPageSize}
    />
  );
};
