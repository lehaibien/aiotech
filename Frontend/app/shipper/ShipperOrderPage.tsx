"use client";

import DataTable, { DataTableRef } from "@/components/core/DataTable";
import { API_URL } from "@/constant/apiUrl";
import { putApi } from "@/lib/apiClient";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import dynamic from "next/dynamic";
import { useSnackbar } from "notistack";
import { useCallback, useRef, useState } from "react";
import { createShipperColumns } from "./columns";
import { ShipperOrderToolbar } from "./ShipperOrderToolbar";

const Dialog = dynamic(() => import("@mui/material/Dialog"), { ssr: false });

export function ShipperOrderPage() {
  const { enqueueSnackbar } = useSnackbar();
  const dataGridRef = useRef<DataTableRef>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  const handleOpenDialog = (id: string) => {
    setSelectedOrder(id);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedOrder(null);
  };

  const handleConfirmDelivery = async () => {
    if (selectedOrder) {
      await onStatusUpdate(selectedOrder, "Delivered");
      handleCloseDialog();
    }
  };

  const onStatusUpdate = useCallback(
    async (id: string, status: string) => {
      const request = {
        id: id,
        status: status,
      };
      const response = await putApi(API_URL.orderStatus, request);
      if (response.success) {
        enqueueSnackbar("Cập nhật trạng thái đơn hàng thành công", {
          variant: "success",
        });
        dataGridRef.current?.reload();
      } else {
        enqueueSnackbar("Cập nhật thất bại: " + response.message, {
          variant: "error",
        });
      }
    },
    [enqueueSnackbar]
  );

  const columns = createShipperColumns(handleOpenDialog);

  return (
    <>
      <ShipperOrderToolbar dataGridRef={dataGridRef} />
      <DataTable
        ref={dataGridRef}
        columns={columns}
        apiUrl={API_URL.order}
        checkboxSelection={false}
        withRowNumber
      />
      {/* Confirmation Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Xác nhận giao hàng thành công
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bạn có chắc chắn muốn xác nhận đơn hàng này đã được giao thành công?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Hủy
          </Button>
          <Button onClick={handleConfirmDelivery} color="primary" autoFocus>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
