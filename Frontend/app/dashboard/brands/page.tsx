"use client";

import { MantineDataTable } from "@/components/data-table/MantineDataTable";
import { useSWRPaginatedList } from "@/config/fetch";
import { API_URL } from "@/constant/apiUrl";
import { brandDataTableColumns } from "@/features/dashboard/brands/brandDataTableColumns";
import { BrandToolbar } from "@/features/dashboard/brands/BrandToolbar";
import { BrandResponse } from "@/types";
import { Stack, Title } from "@mantine/core";
import { DataTableSortStatus } from "mantine-datatable";
import { useState } from "react";

export default function Page() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortStatus, setSortStatus] =
    useState<DataTableSortStatus<BrandResponse>>();
  const [selectedRecords, setSelectedRecords] = useState<BrandResponse[]>([]);
  const { data, isValidating, error, mutate } =
    useSWRPaginatedList<BrandResponse>(
      API_URL.brand,
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
      <Title order={5}>Quản lý thương hiệu</Title>
      <BrandToolbar selectedRows={selectedRecords} onSearch={handleSearch} />
      <MantineDataTable
        minHeight={300}
        columns={brandDataTableColumns}
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
