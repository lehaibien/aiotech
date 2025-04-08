import { CustomDataGridRef } from "@/components/core/CustomDataGrid";
import { DataTableRef } from "@/components/core/DataTable";
import { API_URL } from "@/constant/apiUrl";
import { ERROR_MESSAGE } from "@/constant/message";
import { putApi } from "@/lib/apiClient";
import { parseUUID } from "@/lib/utils";
import { ApiResponse, OrderCancelRequest } from "@/types";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import ErrorIcon from "@mui/icons-material/Error";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { useState } from "react";

type CancelButtonProps = {
  dataGridRef:
    | React.RefObject<CustomDataGridRef>
    | React.RefObject<DataTableRef>;
};

export function CancelButton({ dataGridRef }: CancelButtonProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");

  const handleClickOpen = () => {
    const rowSelection = dataGridRef.current?.rowSelectionModel ?? [];
    if (rowSelection.length === 0) {
      enqueueSnackbar(ERROR_MESSAGE.noRowSelected, { variant: "error" });
      return;
    }
    if (rowSelection.length > 1) {
      enqueueSnackbar(ERROR_MESSAGE.onlyOneRowSelected, { variant: "error" });
      return;
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    const trimmedReason = reason.trim();
    if (trimmedReason === "") {
      enqueueSnackbar("Lý do không được để trống", { variant: "error" });
      return;
    }
    const rowSelection = dataGridRef.current?.rowSelectionModel ?? [];
    if (rowSelection.length > 0) {
      const id = rowSelection[0];
      const parsedId = parseUUID(id.toString());
      const request: OrderCancelRequest = {
        id: parsedId,
        reason: trimmedReason,
      };
      putApi(API_URL.orderCancel, request)
        .then((res: ApiResponse) => {
          if (res.success) {
            enqueueSnackbar(`Hủy thành công`, {
              variant: "success",
            });
            dataGridRef.current?.clearSelection();
            dataGridRef.current?.reload();
          } else {
            enqueueSnackbar("Hủy thất bại: " + res.message, {
              variant: "error",
            });
          }
        })
        .catch((error: Error) => {
          enqueueSnackbar("Hủy thất bại: " + error.message, {
            variant: "error",
          });
        });
      setOpen(false);
    }
  };
  return (
    <>
      <Button
        variant="contained"
        color="error"
        startIcon={<DeleteRoundedIcon />}
        onClick={handleClickOpen}
        sx={{
          textTransform: "none",
          ".MuiButton-startIcon": {
            marginRight: "2px",
          },
        }}
      >
        Hủy
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={(theme) => ({
          border: `1px solid ${theme.palette.error.main}`,
        })}
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <ErrorIcon color="error" />
          <span style={{ marginLeft: 8 }}>Hủy đơn hàng</span>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bạn có muốn hủy đơn hàng này không? Nếu có, vui lòng ghi lý do hủy
            đơn ở bên dưới
            <TextField
              fullWidth
              margin="dense"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy</Button>
          <Button onClick={handleConfirm} autoFocus>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
