"use client";

import { MantineDataTable } from "@/components/data-table/MantineDataTable";
import { useSWRPaginatedList } from "@/config/fetch";
import { API_URL } from "@/constant/apiUrl";
import { categoryDataTableColumns } from "@/features/dashboard/categories/categoryDataTableColumns";
import { CategoryToolbar } from "@/features/dashboard/categories/CategoryToolbar";
import { CategoryResponse } from "@/types";
import { Stack, Title } from "@mantine/core";
import { DataTableSortStatus } from "mantine-datatable";
import { useState } from "react";

export default function Page() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortStatus, setSortStatus] =
    useState<DataTableSortStatus<CategoryResponse>>();
  const [selectedRecords, setSelectedRecords] = useState<CategoryResponse[]>(
    []
  );
  const { data, isValidating, error, mutate } =
    useSWRPaginatedList<CategoryResponse>(
      API_URL.category,
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
      <Title order={5}>Quản lý danh mục sản phẩm</Title>
      <CategoryToolbar selectedRows={selectedRecords} onSearch={handleSearch} />
      <MantineDataTable
        minHeight={300}
        columns={categoryDataTableColumns}
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
        onSortStatusChange={setSortStatus}
      />
    </Stack>
  );
}
