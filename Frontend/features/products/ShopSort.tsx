"use client";

import { productSortData } from "@/constant/sysConstant";
import { Select } from "@mantine/core";
import { useRouter, useSearchParams } from "next/navigation";

type ShopSortProps = {
  defaultSort: string;
};

export const ShopSort = ({ defaultSort }: ShopSortProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const onChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value === "default") {
      params.delete("sort");
    } else {
      params.set("sort", value);
      params.delete("page");
    }
    router.push(`?${params.toString()}`);
  };
  return (
    <Select
      id="sort-select"
      data={productSortData}
      value={defaultSort}
      label="Sắp xếp theo"
      onChange={(_, option) => onChange(option.value)}
    />
  );
};
