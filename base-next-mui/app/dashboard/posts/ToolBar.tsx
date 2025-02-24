"use client";

import { CustomDataGridRef } from "@/components/core/CustomDataGrid";
import { DashboardDeleteButton } from "@/components/dashboard/DashboardDeleteButton";
import { DashboardSearchBar } from "@/components/dashboard/DashboardSearchBar";
import { API_URL } from "@/constant/apiUrl";
import { ERROR_MESSAGE } from "@/constant/message";
import {
  AddRounded,
  EditRounded,
  VisibilityRounded,
} from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import React from "react";

type ToolBarProps = {
  dataGridRef: React.RefObject<CustomDataGridRef>;
  searchTermRef: React.MutableRefObject<string>;
  children?: React.ReactNode;
};

export function ToolBar({
  dataGridRef,
  searchTermRef,
  children,
}: ToolBarProps) {
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
      router.push(`/blog/${selectedData}`);
    }
  }
  function triggerAdd() {
    dataGridRef.current?.clearSelection();
    router.push("/dashboard/posts/upsert");
  }
  function triggerEdit() {
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
      dataGridRef.current?.clearSelection();
      router.push(`/dashboard/posts/upsert?id=${selectedData}`);
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
      <Button
        variant="contained"
        color="secondary"
        onClick={triggerEdit}
        startIcon={<EditRounded />}
        sx={{
          textTransform: "none",
          ".MuiButton-startIcon": {
            marginRight: "2px",
          },
        }}
      >
        Cập nhật
      </Button>
      <DashboardDeleteButton
        apiUrl={API_URL.post}
        name="bài viết"
        dataGridRef={dataGridRef}
      />
      {children}
      <DashboardSearchBar
        dataGridRef={dataGridRef}
        textSearchRef={searchTermRef}
      />
    </Box>
  );
}
