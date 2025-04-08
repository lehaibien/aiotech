import "server-only";

import { API_URL } from "@/constant/apiUrl";
import { getApi, getListApi } from "@/lib/apiClient";
import {
  ComboBoxItem,
  GetListFilteredProductRequest,
  PaginatedList,
  ProductResponse,
  ProductSort,
} from "@/types";
import {
  Box,
  Breadcrumbs,
  CircularProgress,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { Metadata } from "next";
import { Suspense } from "react";
import FilterDrawer from "@/features/products/FilterDrawer";
import ShopList from "@/features/products/ShopList";
import { ShopSort } from "@/features/products/ShopSort";
import HomeIcon from "@mui/icons-material/Home";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import Link from "next/link";

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
  searchParams?: { [key: string]: string | undefined };
}) {
  const pageSize = 12;
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
    const data = productResponse.data as PaginatedList<ProductResponse>;
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
    <Container maxWidth="xl">
      {/* Breadcrumbs Navigation */}
      <Box mb={3}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            <HomeIcon sx={{ mr: 0.5 }} fontSize="small" />
            Trang chủ
          </Link>
          <Typography
            color="text.primary"
            sx={{ display: "flex", alignItems: "center" }}
          >
            <ShoppingBagIcon sx={{ mr: 0.5 }} fontSize="small" />
            Sản phẩm
          </Typography>
        </Breadcrumbs>
      </Box>

      <Paper elevation={1} sx={{ p: { xs: 2, md: 3 }, borderRadius: 2, mb: 4 }}>
        <Typography
          variant="h5"
          component="h1"
          gutterBottom
          sx={{ fontWeight: 600, mb: 3 }}
        >
          Danh sách sản phẩm
        </Typography>

        <Stack spacing={3}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: { xs: "wrap", sm: "nowrap" },
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
      </Paper>
    </Container>
  );
}
