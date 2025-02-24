import { API_URL } from "@/constant/apiUrl";
import { EMPTY_UUID } from "@/constant/common";
import { getApi, getByIdApi } from "@/lib/apiClient";
import { parseUUID } from "@/lib/utils";
import {
  ComboBoxItem,
  ProductRequest,
  ProductRequestDefault,
  ProductUpdateResponse,
} from "@/types";
import "server-only";
import ProductUpsertForm from "./ProductUpsertForm";

export default async function ProductUpsertPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined };
}) {
  let product: ProductRequest = ProductRequestDefault;
  let brandCombobox: ComboBoxItem[] = [];
  let categoryCombobox: ComboBoxItem[] = [];
  let images: string[] = [];
  const parsedId = parseUUID(searchParams?.id ?? "");
  if (parsedId !== EMPTY_UUID) {
    const response = await getByIdApi(API_URL.productRequest, { id: parsedId });
    if (response.success) {
      const data = response.data as ProductUpdateResponse;
      product = {
        id: data.id,
        sku: data.sku,
        name: data.name,
        price: data.price,
        stock: data.stock,
        brandId: data.brandId,
        categoryId: data.categoryId,
        tags: data.tags,
        isFeatured: data.isFeatured,
        description: data.description ?? "",
        images: [],
      };
      images = data.imageUrls;
      // const imagePromises = data.imageUrls.map(async (url) => {
      //   const response = await fetch(url);
      //   const blob = await response.blob();
      //   return new File([blob], url.substring(url.lastIndexOf('/') + 1));
      // });
      // images = await Promise.all(imagePromises);
    }
  }
  const ComboboxPromises = await Promise.all([
    getApi(API_URL.brandComboBox),
    getApi(API_URL.categoryComboBox),
  ]);
  brandCombobox = (ComboboxPromises[0].data as ComboBoxItem[]) ?? [];
  categoryCombobox = (ComboboxPromises[1].data as ComboBoxItem[]) ?? [];
  return (
    <ProductUpsertForm
      defaultImages={images}
      brands={brandCombobox}
      categories={categoryCombobox}
      product={product}
    />
  );
}
