"use client";

import DataTable, { DataTableRef } from "@/components/core/DataTable";
import { API_URL } from "@/constant/apiUrl";
import { useRef } from "react";
import { productGridColumns } from "./productGridColumns";
import { ProductToolbar } from "./ProductToolbar";

export const ProductContent = () => {
  const dataGridRef = useRef<DataTableRef>(null);
  return (
    <>
      <ProductToolbar dataGridRef={dataGridRef} />
      <DataTable
        ref={dataGridRef}
        columns={productGridColumns}
        withRowNumber
        checkboxSelection
        apiUrl={API_URL.product}
      />
    </>
  );
};
