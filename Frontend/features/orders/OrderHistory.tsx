"use client";

import { MantineDataTable } from "@/components/data-table/MantineDataTable";
import { API_URL } from "@/constant/apiUrl";
import { useUserId } from "@/hooks/useUserId";
import { getApi, getListApi } from "@/lib/apiClient";
import { parseUUID } from "@/lib/utils";
import { OrderGetListRequest, OrderResponse, PaginatedList } from "@/types";
import { useCallback, useRef, useState } from "react";
import useSWR from "swr";
import { createOrderHistoryColumns } from "./orderHistoryColumn";

export const OrderHistory = () => {
  const userId = useUserId();
  const searchTerm = useRef("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const handlePrint = useCallback(
    async (id: string, trackingNumber: string) => {
      const response = await getApi(API_URL.order + `/${id}/print`);
      if (response.success) {
        const data = response.data as string;
        const binary = atob(data);
        const buffer = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          buffer[i] = binary.charCodeAt(i);
        }
        const url = window.URL.createObjectURL(new Blob([buffer]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${trackingNumber}.pdf`); //or any other extension
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
    },
    []
  );
  const columns = createOrderHistoryColumns(handlePrint);
  const loadData = useCallback(
    async (
      page: number,
      pageSize: number
    ): Promise<PaginatedList<OrderResponse>> => {
      const getListRequest: OrderGetListRequest = {
        pageIndex: page,
        pageSize,
        textSearch: searchTerm.current,
        customerId: parseUUID(userId),
      };
      const response = await getListApi(API_URL.order, getListRequest);
      if (response.success) {
        const paginatedList = response.data as PaginatedList<OrderResponse>;
        return paginatedList;
      }
      throw new Error(response.message);
    },
    [userId]
  );

  const { data, isValidating, error } = useSWR([page - 1, pageSize], {
    fetcher: loadData,
    revalidateOnMount: true,
    revalidateOnFocus: false,
    errorRetryCount: 2,
    errorRetryInterval: 3000,
  });

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <MantineDataTable
      columns={columns}
      data={data?.items ?? []}
      totalRows={data?.totalCount ?? 0}
      loading={isValidating}
      page={page}
      pageSize={pageSize}
      onPageChange={setPage}
      onPageSizeChange={setPageSize}
    />
  );
};
