"use client";

import { MantineDataTable } from "@/components/data-table/MantineDataTable";
import { useSWRPaginatedList } from "@/config/fetch";
import { API_URL } from "@/constant/apiUrl";
import { productDataTableColumns } from "@/features/dashboard/products/productDataTableColumns";
import { ProductToolbar } from "@/features/dashboard/products/ProductToolbar";
import { ProductResponse } from "@/types";
import { Stack, Title } from "@mantine/core";
import { DataTableSortStatus } from "mantine-datatable";
import { useState } from "react";

export default function Page() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortStatus, setSortStatus] =
    useState<DataTableSortStatus<ProductResponse>>();
  const [selectedRows, setSelectedRows] = useState<ProductResponse[]>([]);
  const { data, isValidating, error, mutate } =
    useSWRPaginatedList<ProductResponse>(
      API_URL.product,
      page,
      pageSize,
      sortStatus?.columnAccessor,
      sortStatus?.direction,
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
      <Title order={5}>Quản lý sản phẩm</Title>
      <ProductToolbar selectedRows={selectedRows} onSearch={handleSearch} />
      <MantineDataTable
        columns={productDataTableColumns}
        data={data?.items || []}
        totalRows={data?.totalCount || 0}
        loading={isValidating}
        checkboxSelection
        withRowNumber
        page={page}
        onPageChange={setPage}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
        onSelectedRecordsChange={setSelectedRows}
        onSortStatusChange={setSortStatus}
      />
    </Stack>
  );
}
