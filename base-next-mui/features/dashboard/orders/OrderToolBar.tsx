"use client";

import { CustomDataGridRef } from "@/components/core/CustomDataGrid";
import { ERROR_MESSAGE } from "@/constant/message";
import { DashboardSearchBar } from "@/features/dashboard/DashboardSearchBar";
import { VisibilityRounded } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import React from "react";
import { CancelButton } from "./CancelButton";

type OrderToolbarProps = {
  dataGridRef: React.RefObject<CustomDataGridRef>;
  searchTermRef: React.MutableRefObject<string>;
  children?: React.ReactNode;
};
export function OrderToolbar({
  dataGridRef,
  searchTermRef,
  children,
}: OrderToolbarProps) {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  function triggerView() {
    const rowSelection = dataGridRef.current?.rowSelectionModel ?? [];
    if (rowSelection.length === 0) {
      enqueueSnackbar(ERROR_MESSAGE.noRowSelected, { variant: "error" });
      return;
    }
    if (rowSelection.length > 1) {
      enqueueSnackbar(ERROR_MESSAGE.onlyOneRowSelected, {
        variant: "error",
      });
      return;
    }
    const selectedData = rowSelection[0];
    if (selectedData) {
      router.push(`/dashboard/orders/${selectedData}`);
    }
  }
  return (
    <Box
      display="flex"
      alignItems="center"
      gap={1}
      paddingBottom={1}
      flexWrap="wrap"
    >
      <Button
        variant="contained"
        color="info"
        onClick={triggerView}
        startIcon={<VisibilityRounded />}
        sx={{
          textTransform: "none",
          ".MuiButton-startIcon": {
            marginRight: "2px",
          },
        }}
      >
        Xem
      </Button>
      <CancelButton dataGridRef={dataGridRef} />
      {children}
      <DashboardSearchBar
        dataGridRef={dataGridRef}
        textSearchRef={searchTermRef}
      />
    </Box>
  );
}
