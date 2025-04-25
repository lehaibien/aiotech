import { DataTableRef } from "@/components/core/DataTable";
import { API_URL } from "@/constant/apiUrl";
import { ERROR_MESSAGE } from "@/constant/message";
import { AddRounded, EditRounded, Visibility } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { DashboardDeleteButton } from "../DashboardDeleteButton";
import { DashboardSearchBar } from "../DashboardSearchBar";

type ProductToolbarProps = {
  dataGridRef: React.RefObject<DataTableRef | null>;
};

export function ProductToolbar({ dataGridRef }: ProductToolbarProps) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  function triggerView() {
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
      router.push(`/dashboard/products/view/${selectedData}`);
    }
  }

  function triggerAdd() {
    dataGridRef.current?.clearSelection();
    router.push("/dashboard/products/upsert");
  }
  function triggerEdit() {
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
      router.push(`/dashboard/products/upsert?id=${selectedData}`);
    }
  }
  return (
    <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
      <Button
        variant="contained"
        color="info"
        onClick={triggerView}
        startIcon={<Visibility />}
        sx={{
          textTransform: "none",
          ".MuiButton-startIcon": {
            marginRight: "2px",
          },
        }}
      >
        Xem
      </Button>
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
        apiUrl={API_URL.product}
        name="sản phẩm"
        dataGridRef={dataGridRef}
      />
      <DashboardSearchBar dataGridRef={dataGridRef} />
    </Box>
  );
}
