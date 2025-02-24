import "server-only";

import FilterDrawer from "@/components/base/products/FilterDrawer";
import ShopList from "@/components/base/products/ShopList";
import { ShopSort } from "@/components/base/products/ShopSort";
import { API_URL } from "@/constant/apiUrl";
import { getApi, getListApi } from "@/lib/apiClient";
import {
  ComboBoxItem,
  GetListProductRequest,
  PaginatedList,
  ProductResponse,
  ProductSort,
} from "@/types";
import { Box, CircularProgress, Stack } from "@mui/material";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Cửa hàng",
  openGraph: {
    title: "Aiotech - Của hàng",
    description: "Mua sắm thiết bị điện tử tại Aiotech",
    url: "https://aiotech.cloud",
    siteName: "Aiotech",
    images: [
      {
        url: "https://aiotech.cloud/images/logo.png",
        width: 500,
        height: 500,
        alt: "Aiotech logo",
      },
    ],
  },
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined };
}) {
  const pageSize = 20;
  const page = searchParams?.page ? Number(searchParams?.page) : 1;
  const category = searchParams?.category;
  const brand = searchParams?.brand;
  const minPrice = searchParams?.minPrice ? Number(searchParams?.minPrice) : 0;
  const maxPrice = searchParams?.maxPrice
    ? Number(searchParams?.maxPrice)
    : Infinity;
  const sort = searchParams?.sort;

  let dataList: PaginatedList<ProductResponse> = {
    items: [],
    pageIndex: page,
    pageSize: pageSize,
    totalCount: 0,
  };
  let categories: ComboBoxItem[] = [];
  let brands: ComboBoxItem[] = [];
  const categoryResponse = await getApi(API_URL.categoryComboBox);
  const brandResponse = await getApi(API_URL.brandComboBox);
  let currentSort = ProductSort.Default;
  switch (sort) {
    case "price_asc":
      currentSort = ProductSort.PriceAsc;
      break;
    case "price_desc":
      currentSort = ProductSort.PriceDesc;
      break;
    case "newest":
      currentSort = ProductSort.Newest;
      break;
    case "oldest":
      currentSort = ProductSort.Oldest;
      break;
    default:
      currentSort = ProductSort.Default;
      break;
  }
  const request: GetListProductRequest = {
    pageIndex: page - 1,
    pageSize: pageSize,
    textSearch: "",
    brands: brand,
    categories: category,
    minPrice: Number(minPrice),
    maxPrice: Number(maxPrice),
    sort: currentSort,
  };
  const response = await getListApi(API_URL.product, request);
  if (response.success) {
    const data = response.data as PaginatedList<ProductResponse>;
    dataList = {
      items: data.items,
      pageIndex: page - 1,
      pageSize: pageSize,
      totalCount: data.totalCount,
    };
  } else {
    console.error("FAILED TO FETCH PRODUCTS: ", response.message);
  }
  if (categoryResponse.success) {
    categories = categoryResponse.data as ComboBoxItem[];
  }
  if (brandResponse.success) {
    brands = brandResponse.data as ComboBoxItem[];
  }
  return (
    <Stack spacing={2}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
        }}
      >
        <FilterDrawer
          brands={brands}
          categories={categories}
          defaultBrands={brand?.split(",")}
          defaultCategories={category?.split(",")}
        />
        <ShopSort defaultSort={sort ?? "default"} />
      </Box>
      <Suspense key={"Products page"} fallback={<CircularProgress />}>
        <ShopList
          items={dataList.items}
          currentPage={page}
          totalPage={Math.ceil(dataList.totalCount / pageSize)}
        />
      </Suspense>
    </Stack>
  );
}
