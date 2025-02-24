import OrderDetail from "@/components/base/profile/OrderDetail";
import { API_URL } from "@/constant/apiUrl";
import { EMPTY_UUID } from "@/constant/common";
import { getByIdApi } from "@/lib/apiClient";
import { parseUUID } from "@/lib/utils";
import { OrderResponse } from "@/types";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Box, Button } from "@mui/material";
import Link from "next/link";
import "server-only";

export default async function Page({ params }: { params: { id: string } }) {
  let order: OrderResponse | undefined = undefined;
  const uuid = parseUUID(params.id);
  if (uuid !== EMPTY_UUID) {
    const response = await getByIdApi(API_URL.order, { id: uuid });
    if (response.success) {
      order = response.data as OrderResponse;
    } else {
      console.error(response.message);
    }
  }
  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Button
          variant="text"
          startIcon={<ArrowBackIcon />}
          LinkComponent={Link}
          href="/dashboard/orders"
          sx={{
            fontWeight: "400",
          }}
        >
          Quay lại
        </Button>
      </Box>
      <OrderDetail order={order} />
    </>
  );
}
