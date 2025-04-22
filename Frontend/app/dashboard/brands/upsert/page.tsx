import { API_URL } from "@/constant/apiUrl";
import { EMPTY_UUID } from "@/constant/common";
import { BrandUpsertForm } from "@/features/dashboard/brands/upsert/BrandUpsertForm";
import { getByIdApi } from "@/lib/apiClient";
import dayjs from "@/lib/extended-dayjs";
import { parseUUID } from "@/lib/utils";
import { BrandResponse, SearchParams, UUID } from "@/types";
import { Stack, Typography } from "@mui/material";

async function getBrandById(id: UUID) {
  const response = await getByIdApi(API_URL.brand, { id });
  if (response.success) {
    return response.data as BrandResponse;
  }
  console.error(response.message);
  return {
    id: EMPTY_UUID,
    name: "",
    imageUrl: "",
    createdDate: dayjs().toDate(),
    createdBy: "",
  };
}

export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { id } = await searchParams;
  const uuid = parseUUID(id);
  const data = await getBrandById(uuid);
  return (
    <Stack spacing={2}>
      <Typography component="h1" variant="h4">
        {uuid === EMPTY_UUID ? "Thêm mới" : "Cập nhật"} thương hiệu
      </Typography>
      <BrandUpsertForm defaultValue={data} />
    </Stack>
  );
}
