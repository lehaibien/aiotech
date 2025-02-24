import { API_URL } from "@/constant/apiUrl";
import { EMPTY_UUID } from "@/constant/common";
import { getByIdApi } from "@/lib/apiClient";
import { parseUUID } from "@/lib/utils";
import { BrandResponse } from "@/types";
import { Card, Typography } from "@mui/material";
import BrandUpsertForm from "./BrandUpsertForm";

async function Page({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined };
}) {
  const uuid = parseUUID(searchParams?.id ?? "");
  let data: BrandResponse = {
    id: EMPTY_UUID,
    name: "",
    imageUrl: "",
    createdDate: new Date(),
    createdBy: "",
  };
  if (uuid !== EMPTY_UUID) {
    const response = await getByIdApi(API_URL.brand, { id: uuid });
    if (response.success) {
      data = response.data as BrandResponse;
    } else {
      console.error(response.message);
    }
  }
  return (
    <Card
      variant="outlined"
      sx={{
        padding: 2,
        display: "flex",
        flexDirection: "column",
        alignSelf: "center",
      }}
    >
      <Typography
        component="h1"
        variant="h4"
        sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
      >
        {uuid === null || uuid === EMPTY_UUID ? "Thêm mới" : "Cập nhật"} thương
        hiệu
      </Typography>
      <BrandUpsertForm brand={data} />
    </Card>
  );
}

export default Page;
