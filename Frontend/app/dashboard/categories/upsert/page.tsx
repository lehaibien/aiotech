import { API_URL } from "@/constant/apiUrl";
import { EMPTY_UUID } from "@/constant/common";
import { CategoryUpsertForm } from "@/features/dashboard/categories/upsert/CategoryUpsertForm";
import { getByIdApi } from "@/lib/apiClient";
import dayjs from "@/lib/extended-dayjs";
import { parseUUID } from "@/lib/utils";
import { CategoryResponse, SearchParams, UUID } from "@/types";
import { Stack, Title } from "@mantine/core";

async function getCategoryById(id: UUID) {
  if (id === EMPTY_UUID) {
    return {
      id: EMPTY_UUID,
      name: "",
      imageUrl: "",
      createdDate: dayjs().toDate(),
      createdBy: "",
    };
  }
  const response = await getByIdApi(API_URL.category, { id });
  if (response.success) {
    return response.data as CategoryResponse;
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
  const data = await getCategoryById(uuid);
  return (
    <Stack>
      <Title order={4}>
        {uuid === EMPTY_UUID ? "Thêm mới" : "Cập nhật"} danh mục sản phẩm
      </Title>
      <CategoryUpsertForm defaultValue={data} />
    </Stack>
  );
}
