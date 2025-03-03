"use client";

import CustomDataGrid, {
  CustomDataGridRef,
} from "@/components/core/CustomDataGrid";
import { DashboardDeleteButton } from "@/features/dashboard/DashboardDeleteButton";
import { DashboardSearchBar } from "@/features/dashboard/DashboardSearchBar";
import { API_URL } from "@/constant/apiUrl";
import { ERROR_MESSAGE } from "@/constant/message";
import { getListApi } from "@/lib/apiClient";
import { CategoryResponse, BaseGetListRequest, PaginatedList } from "@/types";
import { AddRounded, EditRounded } from "@mui/icons-material";
import { Box, Button, Stack, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { useCallback, useRef } from "react";
import { columns } from "./columns";
import NavBreadcrumbs from "@/components/core/NavBreadcrumbs";

const breadcrums = [
  {
    label: "",
    href: "dashboard",
  },
  {
    label: "Quản lý danh mục sản phẩm",
    href: "?",
  },
];

export default function Page() {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const textSearch = useRef("");
  const dataGridRef = useRef<CustomDataGridRef>(null);
  const loadData = useCallback(
    async (
      page: number,
      pageSize: number
    ): Promise<PaginatedList<CategoryResponse>> => {
      const getListRequest: BaseGetListRequest = {
        pageIndex: page,
        pageSize,
        textSearch: textSearch.current,
      };
      const response = await getListApi(API_URL.category, getListRequest);
      if (response.success) {
        const paginatedList = response.data as PaginatedList<CategoryResponse>;
        return paginatedList;
      }
      throw new Error(response.message);
    },
    []
  );
  function triggerAdd() {
    dataGridRef.current?.clearSelection();
    router.push("/dashboard/categories/upsert");
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
      router.push(`/dashboard/categories/upsert?id=${selectedData}`);
    }
  }
  return (
    <Stack gap={2}>
      <NavBreadcrumbs items={breadcrums} />
      <Typography variant="h5">Quản lý danh mục sản phẩm</Typography>
      <Stack>
        <Box
          display="flex"
          alignItems="center"
          gap={1}
          paddingBottom={1}
          flexWrap="wrap"
        >
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
            apiUrl={API_URL.category}
            name="danh mục"
            dataGridRef={dataGridRef}
          />
          <DashboardSearchBar
            dataGridRef={dataGridRef}
            textSearchRef={textSearch}
          />
        </Box>
        <CustomDataGrid
          ref={dataGridRef}
          columns={columns}
          withRowNumber
          checkboxSelection
          loadData={loadData}
        />
      </Stack>
    </Stack>
  );
}
