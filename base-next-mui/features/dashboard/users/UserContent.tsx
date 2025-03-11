"use client";

import DataTable, { DataTableRef } from "@/components/core/DataTable";
import { API_URL } from "@/constant/apiUrl";
import { useRef } from "react";
import { userGridColumns } from "./userGridColumns";
import { UserGridToolbar } from "./UserGridToolbar";

export function UserContent() {
  const dataGridRef = useRef<DataTableRef>(null);
  return (
    <>
      <UserGridToolbar dataGridRef={dataGridRef} />
      <DataTable
        apiUrl={API_URL.user}
        ref={dataGridRef}
        columns={userGridColumns}
        checkboxSelection
        withRowNumber
      />
    </>
  );
}
