"use client";

import { CustomDataGridRef } from "@/components/core/CustomDataGrid";
import { DashboardSearchBar } from "@/components/dashboard/DashboardSearchBar";
import { ERROR_MESSAGE } from "@/constant/message";
import { AddRounded, VisibilityRounded } from "@mui/icons-material";
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
  function triggerAdd() {
    dataGridRef.current?.clearSelection();
    router.push("/dashboard/orders/new");
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
      <Button
        variant="contained"
        color="primary"
        onClick={triggerAdd}
        startIcon={<AddRounded />}
        sx={{
          textTransform: "none",
          ".MuiButton-startIcon": {
            marginRight: "2px",
          },
        }}
      >
        Thêm mới
      </Button>
      {/* <UpdateStatusButton dataGridRef={dataGridRef} /> */}
      <CancelButton dataGridRef={dataGridRef} />
      {children}
      <DashboardSearchBar
        dataGridRef={dataGridRef}
        textSearchRef={searchTermRef}
      />
    </Box>
  );
}
