import { API_URL } from "@/constant/apiUrl";
import ProductView from "@/features/dashboard/products/view/ProductView";
import { getByIdApi } from "@/lib/apiClient";
import { parseUUID } from "@/lib/utils";
import { ProductDetailResponse } from "@/types";

type ProductViewParams = Promise<{
  id: string;
}>;

/**
 * Renders the product detail view for a given product ID.
 *
 * Awaits the provided parameters to extract the product ID, fetches product details from the API, and displays the product view. If the product ID is missing or the product cannot be found, displays a "Product not found" message.
 *
 * @param params - A promise resolving to an object containing the product ID.
 * @returns The product detail view component or a "Product not found" message.
 */
export default async function ProductViewPage({
  params,
}: {
  params: ProductViewParams;
}) {
  const { id } = await params;
  if (!id) {
    return <div>Product not found</div>;
  }
  const parsedId = parseUUID(id);
  const response = await getByIdApi(API_URL.product, { id: parsedId });
  if (!response.success) {
    return <div>Product not found</div>;
  }
  const product = response.data as ProductDetailResponse;

  return <ProductView product={product} />;
}
