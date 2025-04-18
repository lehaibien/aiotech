import { API_URL } from '@/constant/apiUrl';
import { EMPTY_UUID } from '@/constant/common';
import { ProductUpsertForm } from '@/features/dashboard/products/upsert/ProductUpsertForm';
import { getApi, getByIdApi } from '@/lib/apiClient';
import { parseUUID } from '@/lib/utils';
import {
  ComboBoxItem,
  ProductRequest,
  ProductRequestDefault,
  ProductUpdateResponse,
} from '@/types';
import { Stack, Typography } from '@mui/material';
import 'server-only';

export default async function ProductUpsertPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined };
}) {
  let product: ProductRequest = ProductRequestDefault;
  let brandCombobox: ComboBoxItem[] = [];
  let categoryCombobox: ComboBoxItem[] = [];
  let images: string[] = [];
  const parsedId = parseUUID(searchParams?.id ?? '');
  if (parsedId !== EMPTY_UUID) {
    const response = await getByIdApi(API_URL.productRequest, { id: parsedId });
    if (response.success) {
      const data = response.data as ProductUpdateResponse;
      product = {
        id: data.id,
        sku: data.sku,
        name: data.name,
        price: data.price,
        discountPrice: data.discountPrice,
        stock: data.stock,
        brandId: data.brandId,
        categoryId: data.categoryId,
        tags: data.tags,
        isFeatured: data.isFeatured,
        description: data.description ?? '',
        images: [],
      };
      images = data.imageUrls;
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
      <Typography
        component='h1'
        variant='h4'>
        {parsedId === null || parsedId === EMPTY_UUID ? 'Thêm mới' : 'Cập nhật'}{' '}
        sản phẩm
      </Typography>
      <ProductUpsertForm
        defaultImages={images}
        brands={brandCombobox}
        categories={categoryCombobox}
        product={product}
      />
    </Stack>
  );
}
