"use client";

import DataTable, { DataTableRef } from "@/components/core/DataTable";
import { API_URL } from "@/constant/apiUrl";
import { useRef } from "react";
import BrandGridToolbar from "./BrandGridToolbar";
import { brandGridColumns } from "./brandGridColumns";

export function BrandContent() {
  const dataGridRef = useRef<DataTableRef>(null);
  return (
    <>
      <BrandGridToolbar dataGridRef={dataGridRef} />
      <DataTable
        ref={dataGridRef}
        columns={brandGridColumns}
        withRowNumber
        checkboxSelection
        apiUrl={API_URL.brand}
      />
    </>
  );
}
