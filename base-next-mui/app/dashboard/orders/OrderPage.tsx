"use client";

import CustomDataGrid, {
  CustomDataGridRef,
} from "@/components/core/CustomDataGrid";
import { API_URL } from "@/constant/apiUrl";
import { getListApi, putApi } from "@/lib/apiClient";
import { OrderGetListRequest, OrderResponse, PaginatedList } from "@/types";
import { useCallback, useRef } from "react";
import { OrderToolbar } from "@/components/dashboard/orders/OrderToolBar";
import { createColumns } from "./columns";
import { useSnackbar } from "notistack";

export function OrderPage() {
  const { enqueueSnackbar } = useSnackbar();
  const searchTerm = useRef("");
  const dataGridRef = useRef<CustomDataGridRef>(null);
  const onStatusUpdate = useCallback(
    async (id: string, status: string) => {
      const request = {
        id: id,
        status: status,
      };
      const response = await putApi(API_URL.orderStatus, request);
      if (response.success) {
        dataGridRef.current?.reload();
      } else {
        enqueueSnackbar("Cập nhật thất bại: " + response.message, {
          variant: "error",
        });
      }
    },
    [enqueueSnackbar]
  );
  const columns = createColumns(onStatusUpdate);
  const loadData = useCallback(
    async (
      page: number,
      pageSize: number
    ): Promise<PaginatedList<OrderResponse>> => {
      const getListRequest: OrderGetListRequest = {
        pageIndex: page,
        pageSize,
        textSearch: searchTerm.current,
      };
      const response = await getListApi(API_URL.order, getListRequest);
      if (response.success) {
        const paginatedList = response.data as PaginatedList<OrderResponse>;
        return paginatedList;
      }
      throw new Error(response.message);
    },
    []
  );
  return (
    <>
      <OrderToolbar dataGridRef={dataGridRef} searchTermRef={searchTerm} />
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
