"use client";

import { ProductResponse } from "@/types";
import { Box, Grid2 as Grid, Pagination } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useCallback } from "react";
import ProductCard from "../../components/core/ProductCard";
import NoItem from "@/components/core/NoItem";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";

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
      params.set("page", value.toString());
      router.push(`?${params.toString()}`);
    },
    [router, searchParams]
  );
  const message =
    searchParams.size > 0
      ? "Vui lòng thử lại sau hoặc lọc danh sách theo điều kiện khác."
      : "Chúng tôi xin lỗi quý khách, quý khách vui lòng thử lại sau";
  if (items.length === 0) {
    return (
      <Grid container spacing={2}>
        <NoItem
          title={"Không có sản phẩm nào"}
          description={message}
          icon={ShoppingBagIcon}
        />
      </Grid>
    );
  }

  return (
    <>
      <Grid container spacing={2}>
        {items.map((product) => (
          <Grid size={{ xs: 12, sm: 6, md: 3, lg: 12 / 5 }} key={product.id}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>
      <Box mt={2} justifyContent="center">
        <Pagination
          count={totalPage}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        />
      </Box>
    </>
  );
}
