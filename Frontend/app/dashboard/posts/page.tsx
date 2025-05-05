"use client";

import { MantineDataTable } from "@/components/data-table/MantineDataTable";
import { useSWRPaginatedList } from "@/config/fetch";
import { API_URL } from "@/constant/apiUrl";
import { postDataTableColumns } from "@/features/dashboard/posts/postDataTableColumns";
import { PostToolbar } from "@/features/dashboard/posts/PostToolbar";
import { PostResponse } from "@/types";
import { Stack, Title } from "@mantine/core";
import { useState } from "react";

export default function Page() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRecords, setSelectedRecords] = useState<PostResponse[]>(
    []
  );
  const { data, isValidating, error, mutate } =
    useSWRPaginatedList<PostResponse>(
      API_URL.post,
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
      <Title order={5}>Quản lý bài viết</Title>
      <PostToolbar selectedRows={selectedRecords} onSearch={handleSearch} />
      <MantineDataTable
        columns={postDataTableColumns}
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
