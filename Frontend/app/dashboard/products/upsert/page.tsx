import { API_URL } from "@/constant/apiUrl";
import { EMPTY_UUID } from "@/constant/common";
import { ProductUpsertForm } from "@/features/dashboard/products/upsert/ProductUpsertForm";
import { getApi, getByIdApi } from "@/lib/apiClient";
import { parseUUID } from "@/lib/utils";
import {
  ComboBoxItem,
  ProductRequest,
  ProductUpdateResponse,
  SearchParams,
} from "@/types";
import { Divider, Stack, Typography } from "@mui/material";

export default async function ProductUpsertPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { id } = await searchParams;
  const parsedId = parseUUID(id);
  let product: ProductRequest = {
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
    tags: [],
    images: [],
    isFeatured: false,
  };
  let brandCombobox: ComboBoxItem[] = [];
  let categoryCombobox: ComboBoxItem[] = [];
  let imageUrls: string[] = [];
  let thumbnailUrl: string | undefined = undefined;
  if (parsedId !== EMPTY_UUID) {
    const response = await getByIdApi(API_URL.productRequest, { id: parsedId });
    if (response.success) {
      const data = response.data as ProductUpdateResponse;
      product = {
        id: data.id,
        sku: data.sku,
        name: data.name,
        costPrice: data.costPrice,
        price: data.price,
        discountPrice: data.discountPrice,
        stock: data.stock,
        brandId: data.brandId,
        categoryId: data.categoryId,
        tags: data.tags,
        isFeatured: data.isFeatured,
        description: data.description ?? "",
        images: [],
      };
      imageUrls = data.imageUrls;
      thumbnailUrl = data.thumbnailUrl;
    }
  }
  const [brandComboboxResponse, categoryComboboxResponse] = await Promise.all([
    getApi(API_URL.brandComboBox),
    getApi(API_URL.categoryComboBox),
  ]);
  brandCombobox = brandComboboxResponse.data as ComboBoxItem[];
  categoryCombobox = categoryComboboxResponse.data as ComboBoxItem[];
  return (
    <Stack>
      <Typography component="h1" variant="h4">
        {parsedId === null || parsedId === EMPTY_UUID ? "Thêm mới" : "Cập nhật"}{" "}
        sản phẩm
      </Typography>
      <Divider sx={{ my: 1 }} />
      <ProductUpsertForm
        defaultImages={imageUrls}
        defaultThumbnail={thumbnailUrl}
        brands={brandCombobox}
        categories={categoryCombobox}
        product={product}
      />
    </Stack>
  );
}
