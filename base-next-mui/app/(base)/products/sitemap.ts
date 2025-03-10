import { getListApi } from "@/lib/apiClient";
import { GetListFilteredProductRequest, PaginatedList, ProductResponse } from "@/types"
import { MetadataRoute } from "next"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Google's limit is 50,000 URLs per sitemap
    const request: GetListFilteredProductRequest = {
        pageIndex: 0,
        pageSize: 1000,
        textSearch: '',
    }
    const products = await getListApi('product', request);
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

    return (products.data as PaginatedList<ProductResponse>).items.map((product) => ({
      url: `${BASE_URL}/product/${product.id}`,
      lastModified: product.createdDate,
      changeFrequency: 'weekly',
      priority: 1,
    }))
  }