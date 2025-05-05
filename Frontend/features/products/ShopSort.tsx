"use client";

import { Select } from "@mantine/core";
import { useRouter, useSearchParams } from "next/navigation";

type ShopSortProps = {
  defaultSort: string;
};

const sortData = [
  {
    label: "Mặc định",
    value: "default",
  },
  {
    label: "Giá: Thấp đến cao",
    value: "price_asc",
  },
  {
    label: "Giá: Cao đến thấp",
    value: "price_desc",
  },
  {
    label: "Mới nhất",
    value: "newest",
  },
  {
    label: "Cũ nhất",
    value: "oldest",
  },
];

export const ShopSort = ({ defaultSort }: ShopSortProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const onChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("sort", value);
    params.delete("page");
    router.push(`?${params.toString()}`);
  };
  return (
    <Select
      id="sort-select"
      data={sortData}
      value={defaultSort}
      label="Sắp xếp theo"
      onChange={(_, option) => onChange(option.value)}
    />
  );
};
