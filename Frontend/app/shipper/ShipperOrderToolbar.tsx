"use client";

import { DataTableRef } from "@/components/core/DataTable";
import { DashboardSearchBar } from "@/features/dashboard/DashboardSearchBar";
import { Box } from "@mui/material";
import React from "react";

type ShipperOrderToolbarProps = {
  dataGridRef: React.RefObject<DataTableRef>;
};

export function ShipperOrderToolbar({ dataGridRef }: ShipperOrderToolbarProps) {
  return (
    <Box
      display="flex"
      alignItems="center"
      gap={1}
      paddingBottom={1}
      flexWrap="wrap"
    >
      <DashboardSearchBar dataGridRef={dataGridRef} />
    </Box>
  );
}
