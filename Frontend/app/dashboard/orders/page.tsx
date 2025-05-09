"use client";

import { MantineDataTable } from "@/components/data-table/MantineDataTable";
import { useSWRPaginatedList } from "@/config/fetch";
import { API_URL } from "@/constant/apiUrl";
import { createOrderDataTableColumns } from "@/features/dashboard/orders/orderDataTableColumns";
import { putApi } from "@/lib/apiClient";
import { OrderResponse } from "@/types";
import { Stack, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useCallback, useState } from "react";

export default function Page() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRecords, setSelectedRecords] = useState<OrderResponse[]>([]);
  const { data, isValidating, error, mutate } =
    useSWRPaginatedList<OrderResponse>(
      API_URL.order,
      page,
      pageSize,
      undefined,
      undefined,
      searchTerm
    );
  const onStatusUpdate = useCallback(
    async (id: string, status: string) => {
      const request = {
        id: id,
        status: status,
      };
      const response = await putApi(API_URL.orderStatus, request);
      if (response.success) {
        mutate();
        notifications.show({
          message: "Cập nhật thành công",
          color: "green",
        });
      } else {
        notifications.show({
          message: response.message,
          color: "red",
        });
      }
    },
    [mutate]
  );
  const columns = createOrderDataTableColumns(onStatusUpdate);
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
      {/* <BrandToolbar selectedRows={selectedRecords} onSearch={handleSearch} /> */}
      <MantineDataTable
        columns={columns}
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
