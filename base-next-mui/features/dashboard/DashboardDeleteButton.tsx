import { ERROR_MESSAGE } from "@/constant/message";
import { deleteListApi } from "@/lib/apiClient";
import { ApiResponse } from "@/types";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { Button } from "@mui/material";
import { useSnackbar } from "notistack";
import AlertDialog from "../../components/core/AlertDialog";
import { CustomDataGridRef } from "../../components/core/CustomDataGrid";

type DashboardDeleteButtonProps = {
  dataGridRef: React.RefObject<CustomDataGridRef>;
  name: string;
  apiUrl: string;
};

export function DashboardDeleteButton({
  dataGridRef,
  name,
  apiUrl,
}: DashboardDeleteButtonProps) {
  const { enqueueSnackbar } = useSnackbar();
  function triggerDelete() {
    const rowSelection = dataGridRef.current?.rowSelectionModel ?? [];
    if (rowSelection.length > 0) {
      const ids = rowSelection.map((x) => x.toString());
      deleteListApi(apiUrl, ids)
        .then((res: ApiResponse) => {
          if (res.success) {
            enqueueSnackbar(`Xóa thành công ${ids.length} đối tượng`, {
              variant: "success",
            });
            dataGridRef.current?.clearSelection();
            dataGridRef.current?.reload();
          } else {
            enqueueSnackbar("Xóa thất bại: " + res.message, {
              variant: "error",
            });
          }
        })
        .catch((error: Error) => {
          enqueueSnackbar("Xóa thất bại: " + error.message, {
            variant: "error",
          });
        });
    }
  }

  function onBeforeConfirmDelete(): boolean {
    const rowSelection = dataGridRef.current?.rowSelectionModel ?? [];
    if (rowSelection.length === 0) {
      enqueueSnackbar(ERROR_MESSAGE.noRowSelected, { variant: "error" });
      return false;
    }
    return true;
  }
  return (
    <AlertDialog
      title={`Xóa ${name}`}
      content={`Bạn có muốn xoá ${name} này không?`}
      onBeforeShow={onBeforeConfirmDelete}
      onConfirm={triggerDelete}
    >
      <Button
        variant="contained"
        color="error"
        startIcon={<DeleteRoundedIcon />}
        sx={{
          textTransform: "none",
          ".MuiButton-startIcon": {
            marginRight: "2px",
          },
        }}
      >
        Xóa
      </Button>
    </AlertDialog>
  );
}
