"use client";

import { CustomDataGridRef } from "@/components/core/CustomDataGrid";
import { SearchToolBar } from "@/components/core/SearchToolBar";
import { API_URL } from "@/constant/apiUrl";
import { DashboardDeleteButton } from "@/features/dashboard/DashboardDeleteButton";
import { Box } from "@mui/material";
import React from "react";

type ReviewGridToolbarProps = {
  dataGridRef: React.RefObject<CustomDataGridRef>;
  searchTermRef: React.MutableRefObject<string>;
  children?: React.ReactNode;
};
function ReviewGridToolbar({
  dataGridRef,
  searchTermRef,
  children,
}: ReviewGridToolbarProps) {
  function search(searchTerm: string) {
    searchTermRef.current = searchTerm;
    dataGridRef.current?.reload();
  }
  return (
    <Box
      display="flex"
      alignItems="center"
      gap={1}
      paddingBottom={1}
      flexWrap="wrap"
    >
      <DashboardDeleteButton dataGridRef={dataGridRef} apiUrl={API_URL.review} name="đánh giá"/>
      {children}
      <SearchToolBar
        onChange={search}
        sx={(theme) => ({
          marginLeft: "auto",
          [theme.breakpoints.down("md")]: {
            width: "100%",
          },
        })}
      />
    </Box>
  );
}

export default ReviewGridToolbar;
