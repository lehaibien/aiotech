import { API_URL } from '@/constant/apiUrl';
import FilterDrawer from '@/features/products/FilterDrawer';
import ShopList from '@/features/products/ShopList';
import { ShopSort } from '@/features/products/ShopSort';
import { getApi, getListApi } from '@/lib/apiClient';
import {
  ComboBoxItem,
  GetListFilteredProductRequest,
  PaginatedList,
  ProductResponse,
  ProductSort,
} from '@/types';
import {
  Box,
  Breadcrumbs,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material';
import { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';

type SearchParams = Promise<{ [key: string]: string | undefined }>;

export const metadata: Metadata = {
  title: 'Cửa hàng | AioTech',
  description:
    'Mua sắm thiết bị điện tử chính hãng với giá tốt nhất tại AioTech',
  keywords: ['thiết bị điện tử', 'mua sắm', 'công nghệ', 'AioTech', 'cửa hàng'],
  openGraph: {
    title: 'AioTech - Cửa hàng thiết bị điện tử chính hãng',
    description:
      'Mua sắm thiết bị điện tử tại AioTech với đa dạng sản phẩm và dịch vụ hậu mãi tốt nhất',
    url: 'https://aiotech.cloud/products',
    siteName: 'AioTech',
    images: [
      {
        url: 'https://aiotech.cloud/images/logo.png',
        width: 500,
        height: 500,
        alt: 'AioTech logo',
      },
    ],
    type: 'website',
  },
};

/**
 * Renders the main shop page with product listings, filters, and sorting options.
 *
 * Fetches and displays a paginated list of products based on query parameters for category, brand, price range, and sort order. Also loads available categories and brands for filtering. Includes breadcrumb navigation and a loading state for asynchronous data.
 *
 * @param searchParams - Optional promise resolving to query parameters for filtering and sorting products.
 * @returns The shop page React component with product list, filters, and sorting controls.
 */
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
  const maxPrice = params?.maxPrice ? Number(params?.maxPrice) : Infinity;
  const sort = params?.sort;

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
    case 'price_asc':
      currentSort = ProductSort.PriceAsc;
      break;
    case 'price_desc':
      currentSort = ProductSort.PriceDesc;
      break;
    case 'newest':
      currentSort = ProductSort.Newest;
      break;
    case 'oldest':
      currentSort = ProductSort.Oldest;
      break;
    default:
      currentSort = ProductSort.Default;
      break;
  }
  const request: GetListFilteredProductRequest = {
    pageIndex: page - 1,
    pageSize: pageSize,
    textSearch: '',
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
    <Stack gap={1}>
      {/* Breadcrumbs Navigation */}
      <Breadcrumbs aria-label='breadcrumb'>
        <Link
          href='/'
          style={{
            color: 'inherit',
            textDecoration: 'none',
          }}>
          Trang chủ
        </Link>
        <Typography>Sản phẩm</Typography>
      </Breadcrumbs>

      <Box>
        <Typography
          variant='h5'
          component='h1'
          gutterBottom>
          Danh sách sản phẩm
        </Typography>

        <Stack spacing={3}>
          <Stack
            direction='row'
            justifyContent='space-between'
            alignItems='center'>
            <FilterDrawer
              brands={brands}
              categories={categories}
              defaultBrands={brand?.split(',')}
              defaultCategories={category?.split(',')}
            />
            <ShopSort defaultSort={sort ?? 'default'} />
          </Stack>

          <Box sx={{ position: 'relative', minHeight: '200px' }}>
            <Suspense
              key={'Products page'}
              fallback={
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '300px',
                  }}>
                  <CircularProgress
                    size={60}
                    thickness={4}
                  />
                  <Typography
                    variant='body1'
                    sx={{ ml: 2 }}>
                    Đang tải sản phẩm...
                  </Typography>
                </Box>
              }>
              <ShopList
                items={dataList.items}
                currentPage={page}
                totalPage={Math.ceil(dataList.totalCount / pageSize)}
              />
            </Suspense>
          </Box>
        </Stack>
      </Box>
    </Stack>
  );
}
