import { API_URL } from "@/constant/apiUrl";
import { FilterDrawer } from "@/features/products/FilterDrawer";
import { ShopList } from "@/features/products/ShopList";
import { ShopSort } from "@/features/products/ShopSort";
import { getApi, getListApi } from "@/lib/apiClient";
import {
  ComboBoxItem,
  GetListFilteredProductRequest,
  PaginatedList,
  ProductListItemResponse,
  ProductSort,
} from "@/types";
import { Group, Stack, Title } from "@mantine/core";
import { Box, CircularProgress, Typography } from "@mui/material";
import { Metadata } from "next";
import { Suspense } from "react";

type SearchParams = Promise<{ [key: string]: string | undefined }>;

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

export default async function ShopPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const params = await searchParams;
  const pageSize = 12;
  const page = params?.page ? Number(params?.page) : 1;
  const category = params?.category;
  const brand = params?.brand;
  const minPrice = params?.minPrice ? Number(params?.minPrice) : 0;
  const maxPrice = params?.maxPrice ? Number(params?.maxPrice) : 900000000;
  const sort = params?.sort;

  let dataList: PaginatedList<ProductListItemResponse> = {
    items: [],
    pageIndex: page,
    pageSize: pageSize,
    totalCount: 0,
  };
  let categories: ComboBoxItem[] = [];
  let brands: ComboBoxItem[] = [];
  const categoryPromise = getApi(API_URL.categoryComboBox);
  const brandPromise = getApi(API_URL.brandComboBox);
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
  const request: GetListFilteredProductRequest = {
    pageIndex: page - 1,
    pageSize: pageSize,
    textSearch: "",
    brands: brand,
    categories: category,
    minPrice: Number(minPrice),
    maxPrice: Number(maxPrice),
    sort: currentSort,
  };
  const productPromise = getListApi(API_URL.productFiltered, request);
  const [categoryResponse, brandResponse, productResponse] = await Promise.all([
    categoryPromise,
    brandPromise,
    productPromise,
  ]);
  if (productResponse.success) {
    const data = productResponse.data as PaginatedList<ProductListItemResponse>;
    dataList = {
      items: data.items,
      pageIndex: page - 1,
      pageSize: pageSize,
      totalCount: data.totalCount,
    };
  }
  if (categoryResponse.success) {
    categories = categoryResponse.data as ComboBoxItem[];
  }
  if (brandResponse.success) {
    brands = brandResponse.data as ComboBoxItem[];
  }
  return (
    <Stack gap={2}>
      <Title order={1}>Cửa hàng</Title>
      <Stack gap={3}>
        <Group gap={2} justify="space-between">
          <FilterDrawer
            brands={brands}
            categories={categories}
            defaultBrands={brand?.split(",")}
            defaultCategories={category?.split(",")}
          />
          <ShopSort defaultSort={sort ?? "default"} />
        </Group>

        <Box sx={{ position: "relative", minHeight: "200px" }}>
          <Suspense
            key={"Products page"}
            fallback={
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "300px",
                }}
              >
                <CircularProgress size={60} thickness={4} />
                <Typography variant="body1" sx={{ ml: 2 }}>
                  Đang tải sản phẩm...
                </Typography>
              </Box>
            }
          >
            <ShopList
              items={dataList.items}
              currentPage={page}
              totalPage={Math.ceil(dataList.totalCount / pageSize)}
            />
          </Suspense>
        </Box>
      </Stack>
    </Stack>
  );
}
