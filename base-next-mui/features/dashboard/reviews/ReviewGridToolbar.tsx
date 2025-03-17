"use client";

import { DataTableRef } from "@/components/core/DataTable";
import { API_URL } from "@/constant/apiUrl";
import { DashboardDeleteButton } from "@/features/dashboard/DashboardDeleteButton";
import { Box } from "@mui/material";
import React from "react";
import { DashboardSearchBar } from "../DashboardSearchBar";

type ReviewGridToolbarProps = {
  dataGridRef: React.RefObject<DataTableRef>;
  children?: React.ReactNode;
};
function ReviewGridToolbar({ dataGridRef, children }: ReviewGridToolbarProps) {
  return (
    <Box
      display="flex"
      alignItems="center"
      gap={1}
      paddingBottom={1}
      flexWrap="wrap"
    >
      <DashboardDeleteButton
        dataGridRef={dataGridRef}
        apiUrl={API_URL.review}
        name="đánh giá"
      />
      {children}
      <DashboardSearchBar dataGridRef={dataGridRef} />
    </Box>
  );
}

export default ReviewGridToolbar;
