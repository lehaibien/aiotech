"use client";

import DataTable, { DataTableRef } from "@/components/core/DataTable";
import { API_URL } from "@/constant/apiUrl";
import { OrderToolbar } from "@/features/dashboard/orders/OrderToolBar";
import { putApi } from "@/lib/apiClient";
import { useSnackbar } from "notistack";
import { useCallback, useRef } from "react";
import { createOrderGridColumns } from "./orderGridColumns";

export function OrderContent() {
  const { enqueueSnackbar } = useSnackbar();
  const dataGridRef = useRef<DataTableRef>(null);
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
  const columns = createOrderGridColumns(onStatusUpdate);
  return (
    <>
      <OrderToolbar dataGridRef={dataGridRef} />
      <DataTable
        apiUrl={API_URL.order}
        ref={dataGridRef}
        columns={columns}
        withRowNumber
        checkboxSelection
      />
    </>
  );
}
