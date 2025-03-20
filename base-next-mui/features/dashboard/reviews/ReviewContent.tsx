"use client";

import DataTable, { DataTableRef } from "@/components/core/DataTable";
import { API_URL } from "@/constant/apiUrl";
import { useRef } from "react";
import ReviewGridToolbar from "./ReviewGridToolbar";
import { reviewGridColumns } from "./reviewGridColumns";

export function ReviewContent() {
  const dataGridRef = useRef<DataTableRef>(null);
  return (
    <>
      <ReviewGridToolbar dataGridRef={dataGridRef} />
      <DataTable
        ref={dataGridRef}
        columns={reviewGridColumns}
        withRowNumber
        checkboxSelection
        apiUrl={API_URL.review}
      />
    </>
  );
}
