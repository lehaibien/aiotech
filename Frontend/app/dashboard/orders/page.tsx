"use client";

import { MantineDataTable } from "@/components/data-table/MantineDataTable";
import { useSWRPaginatedList } from "@/config/fetch";
import { API_URL } from "@/constant/apiUrl";
import { orderDataTableColumns } from "@/features/dashboard/orders/orderDataTableColumns";
import { OrderToolbar } from "@/features/dashboard/orders/OrderToolBar";
import { OrderResponse } from "@/types";
import { Stack, Title } from "@mantine/core";
import { useState } from "react";

export default function Page() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [, setSelectedRecords] = useState<OrderResponse[]>([]);
  const { data, isValidating, error, mutate } =
    useSWRPaginatedList<OrderResponse>(
      API_URL.order,
      page,
      pageSize,
      undefined,
      undefined,
      searchTerm
    );
  const handleSearch = (searchTerm: string) => {
    setPage(1);
    setSearchTerm(searchTerm);
    mutate();
  };
  if (error) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <Stack>
      <Title order={5}>Quản lý đơn hàng</Title>
      <OrderToolbar onSearch={handleSearch} />
      <MantineDataTable
        minHeight={300}
        columns={orderDataTableColumns}
        data={data?.items || []}
        totalRows={data?.totalCount || 0}
        loading={isValidating}
        checkboxSelection
        withRowNumber
        page={page}
        onPageChange={setPage}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
        onSelectedRecordsChange={setSelectedRecords}
      />
    </Stack>
  );
}
