import AlertDialog from "@/components/core/AlertDialog";
import { CustomDataGridRef } from "@/components/core/CustomDataGrid";
import { DataTableRef } from "@/components/core/DataTable";
import { API_URL } from "@/constant/apiUrl";
import { ERROR_MESSAGE } from "@/constant/message";
import { postApi } from "@/lib/apiClient";
import LockIcon from "@mui/icons-material/Lock";
import { Button } from "@mui/material";
import { useSnackbar } from "notistack";

type UserLockButtonProps = {
  dataGridRef:
    | React.RefObject<CustomDataGridRef>
    | React.RefObject<DataTableRef>;
};

export function UserLockButton({ dataGridRef }: UserLockButtonProps) {
  const { enqueueSnackbar } = useSnackbar();
  async function triggerLock() {
    const rowSelection = dataGridRef.current?.rowSelectionModel.ids;
    if(rowSelection?.size === undefined) {
      enqueueSnackbar(ERROR_MESSAGE.noRowSelected, { variant: "error" });
      return;
    }
    if (rowSelection.size === 0) {
      enqueueSnackbar(ERROR_MESSAGE.noRowSelected, { variant: "error" });
      return;
    }
    if (rowSelection.size > 1) {
      enqueueSnackbar(ERROR_MESSAGE.onlyOneRowSelected, {
        variant: "error",
      });
      return;
    }
    const selectedData = rowSelection.values().next().value;
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

  function onBeforeShow(): boolean {
    const rowSelection = dataGridRef.current?.rowSelectionModel.ids;
    if (rowSelection.size === 0) {
      enqueueSnackbar(ERROR_MESSAGE.noRowSelected, { variant: "error" });
      return false;
    }
    if (rowSelection.size > 1) {
      enqueueSnackbar(ERROR_MESSAGE.onlyOneRowSelected, {
        variant: "error",
      });
      return false;
    }
    return true;
  }
  return (
    <AlertDialog
      title={`Khóa tài khoản`}
      content={`Bạn có muốn khóa tài khoản này không?`}
      onBeforeShow={onBeforeShow}
      onConfirm={triggerLock}
    >
      <Button
        variant="contained"
        color="error"
        startIcon={<LockIcon />}
        sx={{
          textTransform: "none",
          ".MuiButton-startIcon": {
            marginRight: "2px",
          },
        }}
      >
        Khóa tài khoản
      </Button>
    </AlertDialog>
  );
}
