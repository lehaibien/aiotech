import { API_URL } from "@/constant/apiUrl";
import { EMPTY_UUID } from "@/constant/common";
import { getByIdApi } from "@/lib/apiClient";
import { parseUUID } from "@/lib/utils";
import { CategoryResponse } from "@/types";
import { Card, Typography } from "@mui/material";
import dayjs from "@/lib/extended-dayjs";
import { CategoryUpsertForm } from "@/features/dashboard/categories/upsert/CategoryUpsertForm";

export default async function CategoryUpsertPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined };
}) {
  const uuid = parseUUID(searchParams?.id ?? "");
  let data: CategoryResponse = {
    id: EMPTY_UUID,
    name: "",
    imageUrl: "",
    createdDate: dayjs().toDate(),
    createdBy: "",
  };
  if (uuid !== EMPTY_UUID) {
    const response = await getByIdApi(API_URL.category, { id: uuid });
    if (response.success) {
      data = response.data as CategoryResponse;
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
        variant="h4"
      >
        {uuid === null || uuid === EMPTY_UUID ? "Thêm mới" : "Cập nhật"} danh
        mục
      </Typography>
      <CategoryUpsertForm category={data} />
    </Card>
  );
}
