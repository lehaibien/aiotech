"use client";

import { CustomDataGridRef } from "@/components/core/CustomDataGrid";
import { DashboardSearchBar } from "@/features/dashboard/DashboardSearchBar";
import { Box } from "@mui/material";
import React from "react";

type ShipperOrderToolbarProps = {
  dataGridRef: React.RefObject<CustomDataGridRef>;
  searchTermRef: React.MutableRefObject<string>;
};

export function ShipperOrderToolbar({
  dataGridRef,
  searchTermRef,
}: ShipperOrderToolbarProps) {
  return (
    <Box
      display="flex"
      alignItems="center"
      gap={1}
      paddingBottom={1}
      flexWrap="wrap"
    >
      <DashboardSearchBar
        dataGridRef={dataGridRef}
        textSearchRef={searchTermRef}
      />
    </Box>
  );
}