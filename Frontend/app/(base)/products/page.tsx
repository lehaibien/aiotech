import { API_URL } from "@/constant/apiUrl";
import { productSortData } from "@/constant/sysConstant";
import { FilterDrawer } from "@/features/products/FilterDrawer";
import { ShopList } from "@/features/products/ShopList";
import { ShopSort } from "@/features/products/ShopSort";
import { getListApi } from "@/lib/apiClient";
import {
  fetchBrandCombobox,
  fetchCategoryCombobox,
} from "@/lib/comboBoxFetching";
import { parseAsProductSort } from "@/lib/nuqs/parseAsEnum";
import {
  GetListFilteredProductRequest,
  PaginatedList,
  ProductListItemResponse,
  ProductSort,
} from "@/types";
import { Group, Stack, Title } from "@mantine/core";
import { Metadata } from "next";
import type { SearchParams } from "nuqs/server";
import {
  createLoader,
  parseAsArrayOf,
  parseAsFloat,
  parseAsInteger,
  parseAsString,
} from "nuqs/server";

const ProductSearchParams = {
  page: parseAsInteger.withDefault(1),
  category: parseAsArrayOf(parseAsString, ","),
  brand: parseAsArrayOf(parseAsString, ","),
  minPrice: parseAsFloat.withDefault(0),
  maxPrice: parseAsFloat.withDefault(900000000),
  sort: parseAsProductSort,
};

const loader = createLoader(ProductSearchParams);

export const metadata: Metadata = {
  title: "Cửa hàng | AioTech",
  description:
    "Mua sắm thiết bị điện tử chính hãng với giá tốt nhất tại AioTech",
  keywords: ["thiết bị điện tử", "mua sắm", "công nghệ", "AioTech", "cửa hàng"],
  openGraph: {
    title: "AioTech - Cửa hàng thiết bị điện tử chính hãng",
    description:
      "Mua sắm thiết bị điện tử tại AioTech với đa dạng sản phẩm và dịch vụ hậu mãi tốt nhất",
    url: "https://aiotech.cloud/products",
    siteName: "AioTech",
    images: [
      {
        url: "https://aiotech.cloud/images/logo.png",
        width: 500,
        height: 500,
        alt: "AioTech logo",
      },
    ],
    type: "website",
  },
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { page, category, brand, minPrice, maxPrice, sort } = await loader(
    searchParams
  );
  const pageSize = 12;

  let dataList: PaginatedList<ProductListItemResponse> = {
    items: [],
    pageIndex: page,
    pageSize: pageSize,
    totalCount: 0,
  };
  const categoryCombobox = await fetchCategoryCombobox();
  const brandCombobox = await fetchBrandCombobox();
  const request: GetListFilteredProductRequest = {
    pageIndex: page - 1,
    pageSize: pageSize,
    textSearch: "",
    brands: brand?.join(",") ?? "",
    categories: category?.join(",") ?? "",
    minPrice: minPrice,
    maxPrice: maxPrice,
    sort: sort ?? ProductSort.Default,
  };
  console.log("Requesting: ", request);
  const productResponse = await getListApi(API_URL.productFiltered, request);
  console.log("Response: ", productResponse);
  if (productResponse.success) {
    const data = productResponse.data as PaginatedList<ProductListItemResponse>;
    dataList = {
      items: data.items,
      pageIndex: page - 1,
      pageSize: pageSize,
      totalCount: data.totalCount,
    };
  }
  return (
    <Stack>
      <Title order={1}>Cửa hàng</Title>
      <Group justify="space-between">
        <FilterDrawer
          brands={brandCombobox}
          categories={categoryCombobox}
          defaultBrands={brand ?? []}
          defaultCategories={category ?? []}
        />
        <ShopSort
          defaultSort={productSortData[Number(sort)]?.value ?? "default"}
        />
      </Group>

      <ShopList
        items={dataList.items}
        currentPage={page}
        totalPage={Math.ceil(dataList.totalCount / pageSize)}
      />
    </Stack>
  );
}
