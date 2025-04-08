"use client";

import { CustomDataGridRef } from "@/components/core/CustomDataGrid";
import { SearchToolBar } from "@/components/core/SearchToolBar";
import { ERROR_MESSAGE } from "@/constant/message";
import { AddRounded, DeleteRounded, EditRounded } from "@mui/icons-material";
import { Button, Grid2 as Grid } from "@mui/material";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import React from "react";

type DashboardToolbarProps = {
  dataGridRef: React.RefObject<CustomDataGridRef>;
  searchTermRef: React.MutableRefObject<string>;
  children?: React.ReactElement | React.ReactElement[];
};
export function DashboardToolbar({
  dataGridRef,
  searchTermRef,
  children,
}: DashboardToolbarProps) {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  function triggerAdd() {
    dataGridRef.current?.clearSelection();
    router.push("/dashboard/Dashboards/upsert");
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
      router.push(`/dashboard/Dashboards/upsert?id=${selectedData}`);
    }
  }

  function triggerDelete() {
    const rowSelection = dataGridRef.current?.rowSelectionModel ?? [];
    if (rowSelection.length === 0) {
      enqueueSnackbar(ERROR_MESSAGE.noRowSelected, { variant: "error" });
      return;
    }
    const selectedData = rowSelection[0];
    if (selectedData) {
      enqueueSnackbar("Chức năng xóa chưa được triển khai", {
        variant: "error",
      });
    }
  }
  function search(searchTerm: string) {
    searchTermRef.current = searchTerm;
    dataGridRef.current?.reload();
  }
  return (
    <Grid container>
      <Grid size={{ xs: 12, md: 6 }}>
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
      </Grid>
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
      <Button
        variant="contained"
        color="error"
        onClick={triggerDelete}
        startIcon={<DeleteRounded />}
        sx={{
          textTransform: "none",
          ".MuiButton-startIcon": {
            marginRight: "2px",
          },
        }}
      >
        Xóa
      </Button>
      {children instanceof Array ? (
        children.map((child, index) => <Grid key={index}>{child}</Grid>)
      ) : (
        <Grid>{children}</Grid>
      )}
      <SearchToolBar
        onChange={search}
        sx={(theme) => ({
          marginLeft: "auto",
          [theme.breakpoints.down("md")]: {
            width: "100%",
          },
        })}
      />
    </Grid>
  );
}
