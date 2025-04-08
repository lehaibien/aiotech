"use client";

import DataTable, { DataTableRef } from "@/components/core/DataTable";
import { API_URL } from "@/constant/apiUrl";
import { useRef } from "react";
import { productGridColumns } from "./productGridColumns";
import { ProductToolbar } from "./ProductToolbar";

export function ProductContent() {
  const dataGridRef = useRef<DataTableRef>(null);
  // const loadData = useCallback(
  //   async (
  //     page: number,
  //     pageSize: number
  //   ): Promise<PaginatedList<ProductResponse>> => {
  //     const getListRequest: GetListRequest = {
  //       pageIndex: page,
  //       pageSize,
  //       textSearch: textSearch.current,
  //     };
  //     const response = await getListApi(API_URL.product, getListRequest);
  //     if (response.success) {
  //       const paginatedList = response.data as PaginatedList<ProductResponse>;
  //       return paginatedList;
  //     }
  //     throw new Error(response.message);
  //   },
  //   []
  // );
  return (
    <>
      <ProductToolbar dataGridRef={dataGridRef} />
      {/* <CustomDataGrid
        ref={dataGridRef}
        columns={productGridColumns}
        withRowNumber
        checkboxSelection
        loadData={loadData}
      /> */}
      <DataTable
        ref={dataGridRef}
        columns={productGridColumns}
        withRowNumber
        checkboxSelection
        apiUrl={API_URL.product}
      />
    </>
  );
}
