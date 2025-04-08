"use client";

import DataTable, { DataTableRef } from "@/components/core/DataTable";
import { API_URL } from "@/constant/apiUrl";
import { useRef } from "react";
import { CategoryGridToolbar } from "./CategoryGridToolbar";
import { categoryGridColumns } from "./categoryGridColumns";

export function CategoryContent() {
  const dataGridRef = useRef<DataTableRef>(null);
  return (
    <>
      <CategoryGridToolbar dataGridRef={dataGridRef} />
      <DataTable
        ref={dataGridRef}
        columns={categoryGridColumns}
        withRowNumber
        checkboxSelection
        apiUrl={API_URL.category}
      />
    </>
  );
}
