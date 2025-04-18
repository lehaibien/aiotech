"use client";

import AlertDialog from "@/components/core/AlertDialog";
import { API_URL } from "@/constant/apiUrl";
import { getApi, postApi, putApi } from "@/lib/apiClient";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckIcon from "@mui/icons-material/Check";
import PrintIcon from "@mui/icons-material/Print";
import { Box, Button } from "@mui/material";
import { UUID } from "crypto";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { useCallback, useMemo } from "react";

type OrderDetailActionProps = {
  id: UUID;
  status: string;
  trackingNumber: string;
};

export function OrderDetailAction({ id, status, trackingNumber }: OrderDetailActionProps) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const isCancelable = useMemo(() => {
    return (
      status.toLowerCase() === "pending" ||
      status.toLowerCase() === "paid" ||
      status.toLowerCase() === "processing"
    );
  }, [status]);
  const handleConfirm = useCallback(
    async (id: string) => {
      if (status.toLowerCase() === "delivered") {
        const response = await postApi(API_URL.orderConfirm + `/${id}`, {});
        if (response.success) {
          enqueueSnackbar("Xác nhận đơn hàng thành công", {
            variant: "success",
          });
          router.refresh();
        } else {
          enqueueSnackbar("Xác nhận đơn hàng thất bại: " + response.message, {
            variant: "error",
          });
        }
      }
    },
    [enqueueSnackbar, router, status]
  );
  const handlePrint = useCallback(async (id: string) => {
    const response = await getApi(API_URL.order + `/${id}/print`);
    if (response.success) {
      const data = response.data as string;
      const binary = atob(data);
      const buffer = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        buffer[i] = binary.charCodeAt(i);
      }
      const url = window.URL.createObjectURL(new Blob([buffer]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${trackingNumber}.pdf`); 
      document.body.appendChild(link);
      link.click();
      // clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }
  }, []);
  const handleCancel = async () => {
    const request = {
      id: id,
      reason: "Người mua hủy",
    };
    const response = await putApi(API_URL.orderCancel, request);
    if (response.success) {
      enqueueSnackbar("Hủy đơn hàng thành công", {
        variant: "success",
      });
      router.push("/profile/?tab=2");
    } else {
      enqueueSnackbar("Hủy đơn hàng thất bại: " + response.message, {
        variant: "error",
      });
    }
  };
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Button
        onClick={() => handleConfirm(id)}
        startIcon={<CheckIcon />}
        color="primary"
        disabled={status.toLowerCase() !== "delivered"}
      >
        Đã nhận hàng
      </Button>
      <Button onClick={() => handlePrint(id)} startIcon={<PrintIcon />}>
        In
      </Button>

      <AlertDialog
        title="Hủy đơn hàng"
        content="Bạn có chắc chắn muốn hủy đơn hàng này không? Mọi thao tác sẽ không được hoàn lại"
        onConfirm={handleCancel}
      >
        <Button
          color="error"
          startIcon={<CancelIcon />}
          disabled={isCancelable === false}
        >
          Hủy
        </Button>
      </AlertDialog>
    </Box>
  );
}
