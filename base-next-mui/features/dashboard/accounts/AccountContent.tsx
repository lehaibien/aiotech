"use client";

import DataTable, { DataTableRef } from "@/components/core/DataTable";
import { API_URL } from "@/constant/apiUrl";
import { useRef } from "react";
import { accountGridColumns } from "./accountGridColumns";
import { AccountGridToolbar } from "./AccountGridToolbar";

export function AccountContent() {
  const dataGridRef = useRef<DataTableRef>(null);
  return (
    <>
      <AccountGridToolbar dataGridRef={dataGridRef} />
      <DataTable
        apiUrl={API_URL.user}
        ref={dataGridRef}
        columns={accountGridColumns}
        checkboxSelection
        withRowNumber
      />
    </>
  );
}
