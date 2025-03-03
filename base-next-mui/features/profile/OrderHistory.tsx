import CustomDataGrid, {
  CustomDataGridRef,
} from "@/components/core/CustomDataGrid";
import { API_URL } from "@/constant/apiUrl";
import { getApi, getListApi } from "@/lib/apiClient";
import {
  formatDateFromString,
  formatNumberWithSeperator,
  mapOrderStatus,
  parseUUID,
} from "@/lib/utils";
import { OrderGetListRequest, OrderResponse, PaginatedList } from "@/types";
import PrintIcon from "@mui/icons-material/Print";
import ViewIcon from "@mui/icons-material/RemoveRedEye";
import { IconButton } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useCallback, useMemo, useRef } from "react";

const createColumns = (
  onPrint: (id: string) => void
): GridColDef<OrderResponse>[] => [
  {
    field: "trackingNumber",
    headerName: "Mã đơn hàng",
    width: 250,
  },
  {
    field: "name",
    headerName: "Tên khách hàng",
    width: 200,
  },
  {
    field: "createdDate",
    headerName: "Ngày đặt hàng",
    width: 200,
    headerAlign: "center",
    align: "center",
    valueFormatter: (params) => formatDateFromString(params),
  },
  {
    field: "totalPrice",
    headerName: "Thành tiền",
    flex: 1,
    headerAlign: "right",
    align: "right",
    valueFormatter: (params) => formatNumberWithSeperator(params as number),
  },
  {
    field: "status",
    headerName: "Trạng thái",
    width: 200,
    headerAlign: "center",
    align: "center",
    valueFormatter: (params) => mapOrderStatus(params as string),
  },
  {
    field: "shippedDate",
    headerName: "Ngày giao hàng",
    width: 200,
    headerAlign: "center",
    align: "center",
    valueFormatter: (params) => formatDateFromString(params),
  },
  {
    field: "action",
    headerName: "Hành động",
    width: 150,
    headerAlign: "center",
    align: "center",
    renderCell: (params) => (
      <>
        <IconButton
          LinkComponent={Link}
          href={`/profile/orders/${params.row.id}`}
        >
          <ViewIcon />
        </IconButton>
        <IconButton onClick={() => onPrint(params.row.id)}>
          <PrintIcon />
        </IconButton>
      </>
    ),
  },
];

function OrderHistory() {
  const searchTerm = useRef("");
  const dataGridRef = useRef<CustomDataGridRef>(null);
  const { data: session } = useSession();
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
      link.setAttribute("download", "receipt.pdf"); //or any other extension
      document.body.appendChild(link);
      link.click();
      // clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }
  }, []);

  const columns = useMemo(() => createColumns(handlePrint), [handlePrint]);

  const loadData = useCallback(
    async (
      page: number,
      pageSize: number
    ): Promise<PaginatedList<OrderResponse>> => {
      const getListRequest: OrderGetListRequest = {
        pageIndex: page,
        pageSize,
        textSearch: searchTerm.current,
        customerId: parseUUID(session?.user.id ?? "") ?? undefined,
      };
      const response = await getListApi(API_URL.order, getListRequest);
      if (response.success) {
        const paginatedList = response.data as PaginatedList<OrderResponse>;
        return paginatedList;
      }
      throw new Error(response.message);
    },
    [session?.user.id]
  );

  return (
    <CustomDataGrid
      ref={dataGridRef}
      columns={columns}
      withRowNumber
      checkboxSelection={false}
      loadData={loadData}
    />
  );
}

export default OrderHistory;
