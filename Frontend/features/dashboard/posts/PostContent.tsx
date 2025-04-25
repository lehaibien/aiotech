"use client";

import DataTable, { DataTableRef } from "@/components/core/DataTable";
import { API_URL } from "@/constant/apiUrl";
import { useRef } from "react";
import { postGridColumns } from "./postGridColumns";
import { PostToolbar } from "./PostToolbar";

export const PostContent = () => {
  const dataGridRef = useRef<DataTableRef>(null);
  return (
    <>
      <PostToolbar dataGridRef={dataGridRef} />
      <DataTable
        ref={dataGridRef}
        columns={postGridColumns}
        withRowNumber
        checkboxSelection
        apiUrl={API_URL.post}
      />
    </>
  );
};
