import { DataTableRef } from "@/components/core/DataTable";
import { API_URL } from "@/constant/apiUrl";
import { ERROR_MESSAGE } from "@/constant/message";
import { postApi } from "@/lib/apiClient";
import { AddRounded, EditRounded, Lock } from "@mui/icons-material";
import { Button, Stack } from "@mui/material";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { DashboardDeleteButton } from "../DashboardDeleteButton";
import { DashboardSearchBar } from "../DashboardSearchBar";

type UserGridToolbarProps = {
  dataGridRef: React.RefObject<DataTableRef>;
};

export function UserGridToolbar({ dataGridRef }: UserGridToolbarProps) {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  function triggerAdd() {
    dataGridRef.current?.clearSelection();
    router.push("/dashboard/users/upsert");
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
      router.push(`/dashboard/users/upsert?id=${selectedData}`);
    }
  }
  async function triggerLock() {
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
      const response = await postApi(API_URL.userLock + `/${selectedData}`, {});
      if (response.success) {
        enqueueSnackbar("Khóa tài khoản thành công", { variant: "success" });
        dataGridRef.current?.reload();
      } else {
        enqueueSnackbar(response.message, { variant: "error" });
      }
    }
  }
  return (
    <Stack
      direction="row"
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
        apiUrl={API_URL.user}
        name="tài khoản"
        dataGridRef={dataGridRef}
      />
      <Button
        variant="contained"
        color="error"
        onClick={triggerLock}
        startIcon={<Lock />}
        sx={{
          textTransform: "none",
          ".MuiButton-startIcon": {
            marginRight: "2px",
          },
        }}
      >
        Khóa tài khoản
      </Button>
      <DashboardSearchBar dataGridRef={dataGridRef} />
    </Stack>
  );
}
