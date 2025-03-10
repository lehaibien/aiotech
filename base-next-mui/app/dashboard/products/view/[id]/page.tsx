import { API_URL } from "@/constant/apiUrl";
import ProductView from "@/features/dashboard/products/view/ProductView";
import { getByIdApi } from "@/lib/apiClient";
import { parseUUID } from "@/lib/utils";
import { ProductDetailResponse } from "@/types";
import "server-only";

export default async function ProductViewPage({
  params,
}: {
  params: { id: string };
}) {
  if (!params.id) {
    return <div>Product not found</div>;
  }
  const parsedId = parseUUID(params.id);
  const response = await getByIdApi(API_URL.product, { id: parsedId });
  if (!response.success) {
    return <div>Product not found</div>;
  }
  const product = response.data as ProductDetailResponse;

  return <ProductView product={product} />;
}
