"use client";

import CustomDataGrid, {
    CustomDataGridRef,
} from "@/components/core/CustomDataGrid";
import { API_URL } from "@/constant/apiUrl";
import { getListApi, putApi } from "@/lib/apiClient";
import { OrderGetListRequest, OrderResponse, OrderStatus, PaginatedList } from "@/types";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { useSnackbar } from "notistack";
import { useCallback, useRef, useState } from "react";
import { createShipperColumns } from "./columns";
import { ShipperOrderToolbar } from "./ShipperOrderToolbar";

export function ShipperOrderPage() {
  const { enqueueSnackbar } = useSnackbar();
  const searchTerm = useRef("");
  const dataGridRef = useRef<CustomDataGridRef>(null);
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

  const loadData = useCallback(
    async (
      page: number,
      pageSize: number
    ): Promise<PaginatedList<OrderResponse>> => {
      const getListRequest: OrderGetListRequest = {
        pageIndex: page,
        pageSize,
        textSearch: searchTerm.current,
        statuses: [OrderStatus.Delivering, OrderStatus.Delivered],
      };
      const response = await getListApi(API_URL.order, getListRequest);
      if (response.success) {
        const paginatedList = response.data as PaginatedList<OrderResponse>;
        return paginatedList;
      }
      throw new Error(response.message);
    },
    []
  );

  return (
    <>
      <ShipperOrderToolbar dataGridRef={dataGridRef} searchTermRef={searchTerm} />
      <CustomDataGrid
        ref={dataGridRef}
        columns={columns}
        withRowNumber
        loadData={loadData}
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