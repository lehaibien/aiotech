"use client";

import { NoItem } from "@/components/core/NoItem";
import { ProductCard } from "@/components/core/ProductCard";
import { ProductListItemResponse } from "@/types";
import { Center, Pagination, SimpleGrid, Stack } from "@mantine/core";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

type ShopListProps = {
  items: ProductListItemResponse[];
  currentPage: number;
  totalPage: number;
};

export const ShopList = ({ items, currentPage, totalPage }: ShopListProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const handlePageChange = useCallback(
    (value: number) => {
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
      <NoItem
        title={"Không có sản phẩm nào"}
        description={message}
        icon={ShoppingBagIcon}
      />
    );
  }

  return (
    <Stack gap={8}>
      <SimpleGrid
        cols={{
          xs: 1,
          md: 2,
          lg: 4,
        }}
      >
        {items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </SimpleGrid>
      <Center>
        <Pagination
          total={totalPage}
          defaultValue={currentPage}
          onChange={handlePageChange}
        />
      </Center>
    </Stack>
  );
};
