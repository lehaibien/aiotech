import { API_URL } from "@/constant/apiUrl";
import { EMPTY_UUID } from "@/constant/common";
import { ProductUpsertForm } from "@/features/dashboard/products/upsert/ProductUpsertForm";
import { getApi, getByIdApi } from "@/lib/apiClient";
import { parseUUID } from "@/lib/utils";
import {
  ComboBoxItem,
  ProductUpdateResponse,
  SearchParams,
  UUID
} from "@/types";
import { Stack, Title } from "@mantine/core";

async function getProductUpdateById(id: UUID) {
  if (id === EMPTY_UUID) {
    return {
      id: EMPTY_UUID,
      sku: "",
      name: "",
      description: "",
      costPrice: 0,
      price: 0,
      discountPrice: 0,
      stock: 0,
      brandId: EMPTY_UUID,
      categoryId: EMPTY_UUID,
      thumbnailUrl: undefined,
      imageUrls: [],
      tags: [],
      isFeatured: false,
    }
  }
  const response = await getByIdApi(API_URL.productRequest, { id });
  if (response.success) {
    return response.data as ProductUpdateResponse;
  }
  console.error(response.message);
  return {
    id: EMPTY_UUID,
    sku: "",
    name: "",
    description: "",
    costPrice: 0,
    price: 0,
    discountPrice: 0,
    stock: 0,
    brandId: EMPTY_UUID,
    categoryId: EMPTY_UUID,
    thumbnailUrl: undefined,
    imageUrls: [],
    tags: [],
    isFeatured: false,
  }
}

export default async function ProductUpsertPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { id } = await searchParams;
  const parsedId = parseUUID(id);
  const product = await getProductUpdateById(parsedId);
  let brandCombobox: ComboBoxItem[] = [];
  let categoryCombobox: ComboBoxItem[] = [];
  const [brandComboboxResponse, categoryComboboxResponse] = await Promise.all([
    getApi(API_URL.brandComboBox),
    getApi(API_URL.categoryComboBox),
  ]);
  brandCombobox = brandComboboxResponse.data as ComboBoxItem[];
  categoryCombobox = categoryComboboxResponse.data as ComboBoxItem[];
  return (
    <Stack>
      <Title order={4}>
        {parsedId === null || parsedId === EMPTY_UUID ? "Thêm mới" : "Cập nhật"}{" "}
        sản phẩm
      </Title>
      <ProductUpsertForm
        brands={brandCombobox}
        categories={categoryCombobox}
        product={product}
      />
    </Stack>
  );
}
