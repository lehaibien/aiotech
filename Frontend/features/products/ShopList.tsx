'use client';

import { ProductResponse } from '@/types';
import { Box, Grid, Pagination } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import { ProductCard } from '@/components/core/ProductCard';
import { NoItem } from '@/components/core/NoItem';

type ShopListProps = {
  items: ProductResponse[];
  currentPage: number;
  totalPage: number;
};

export default function ShopList({
  items,
  currentPage,
  totalPage,
}: ShopListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = useCallback(
    (event: React.ChangeEvent<unknown>, value: number) => {
      const params = new URLSearchParams(searchParams);
      params.set('page', value.toString());
      router.push(`?${params.toString()}`);
    },
    [router, searchParams]
  );
  const message =
    searchParams.size > 0
      ? 'Vui lòng thử lại sau hoặc lọc danh sách theo điều kiện khác.'
      : 'Chúng tôi xin lỗi quý khách, quý khách vui lòng thử lại sau';
  if (items.length === 0) {
    return (
      <Grid
        container
        spacing={2}>
        <NoItem
          title={'Không có sản phẩm nào'}
          description={message}
          icon={ShoppingBagIcon}
        />
      </Grid>
    );
  }

  return (
    <>
      <Grid
        container
        spacing={2}>
        {items.map((product) => (
          <Grid
            size={{ xs: 12, md: 6, lg: 3 }}
            key={product.id}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>
      <Box
        mt={2}
        justifyContent='center'>
        <Pagination
          count={totalPage}
          page={currentPage}
          variant='text'
          shape='rounded'
          onChange={handlePageChange}
          color='primary'
          sx={{
            display: 'flex',
            justifyContent: 'center',
          }}
        />
      </Box>
    </>
  );
}
