import AlertDialog from "@/components/core/AlertDialog";
import { CustomDataGridRef } from "@/components/core/CustomDataGrid";
import { DataTableRef } from "@/components/core/DataTable";
import { ERROR_MESSAGE } from "@/constant/message";
import { deleteListApi } from "@/lib/apiClient";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { Button } from "@mui/material";
import { useSnackbar } from "notistack";

type DashboardDeleteButtonProps = {
  dataGridRef:
    | React.RefObject<CustomDataGridRef>
    | React.RefObject<DataTableRef>;
  name: string;
  apiUrl: string;
};

export function DashboardDeleteButton({
  dataGridRef,
  name,
  apiUrl,
}: DashboardDeleteButtonProps) {
  const { enqueueSnackbar } = useSnackbar();
  const triggerDelete = async () => {
    const rowSelection = dataGridRef.current?.rowSelectionModel ?? [];
    if (rowSelection.length > 0) {
      const ids = rowSelection.map((x) => x.toString());
      const response = await deleteListApi(apiUrl, ids);
      if (response.success) {
        enqueueSnackbar(`Xóa thành công ${ids.length} đối tượng`, {
          variant: "success",
        });
        dataGridRef.current?.clearSelection();
        dataGridRef.current?.reload();
        return;
      }
      enqueueSnackbar("Xóa thất bại: " + response.message, {
        variant: "error",
      });
    }
  };

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
