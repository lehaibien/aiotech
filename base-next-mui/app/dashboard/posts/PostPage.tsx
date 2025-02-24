"use client";

import CustomDataGrid, {
  CustomDataGridRef,
} from "@/components/core/CustomDataGrid";
import { API_URL } from "@/constant/apiUrl";
import { getListApi } from "@/lib/apiClient";
import { GetListRequest, PaginatedList, PostResponse } from "@/types";
import { useCallback, useRef } from "react";
import { columns } from "./columns";
import { ToolBar } from "./ToolBar";

export function PostView() {
  const searchTerm = useRef("");
  const dataGridRef = useRef<CustomDataGridRef>(null);
  const loadData = useCallback(
    async (
      page: number,
      pageSize: number
    ): Promise<PaginatedList<PostResponse>> => {
      const getListRequest: GetListRequest = {
        pageIndex: page,
        pageSize,
        textSearch: searchTerm.current,
      };
      const response = await getListApi(API_URL.post, getListRequest);
      if (response.success) {
        const paginatedList = response.data as PaginatedList<PostResponse>;
        return paginatedList;
      }
      throw new Error(response.message);
    },
    []
  );
  return (
    <>
      <ToolBar dataGridRef={dataGridRef} searchTermRef={searchTerm} />
      <CustomDataGrid
        ref={dataGridRef}
        columns={columns}
        withRowNumber
        checkboxSelection
        loadData={loadData}
      />
    </>
  );
}
