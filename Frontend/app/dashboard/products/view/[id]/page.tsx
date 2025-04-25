import { API_URL } from "@/constant/apiUrl";
import ProductView from "@/features/dashboard/products/view/ProductView";
import { getByIdApi } from "@/lib/apiClient";
import { parseUUID } from "@/lib/utils";
import { ProductDetailResponse } from "@/types";

type ProductViewParams = Promise<{
  id: string;
}>;

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
