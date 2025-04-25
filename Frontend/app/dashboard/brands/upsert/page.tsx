import { API_URL } from "@/constant/apiUrl";
import { EMPTY_UUID } from "@/constant/common";
import { BrandUpsertForm } from "@/features/dashboard/brands/upsert/BrandUpsertForm";
import { getByIdApi } from "@/lib/apiClient";
import dayjs from "@/lib/extended-dayjs";
import { parseUUID } from "@/lib/utils";
import { BrandResponse, SearchParams, UUID } from "@/types";
import { Stack, Typography } from "@mui/material";

/**
 * Retrieves brand data by its UUID, returning a default empty brand object if the fetch fails.
 *
 * @param id - The UUID of the brand to retrieve.
 * @returns The brand data as a {@link BrandResponse}, or a default empty brand object if not found.
 *
 * @remark If the API call fails, an error is logged and a default brand object with empty fields is returned.
 */
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

/**
 * Renders the brand upsert page, displaying a form for creating or updating a brand based on the provided search parameters.
 *
 * @param searchParams - Query parameters containing the brand ID to edit, or empty for creating a new brand.
 * @returns The JSX layout for the brand upsert form with appropriate heading and default values.
 */
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
