"use client";

import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";

interface ShopSortProps {
  defaultSort: string;
}

export function ShopSort({ defaultSort }: ShopSortProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const onChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    const params = new URLSearchParams(searchParams);
    params.set("sort", value);
    params.delete("page");
    router.push(`?${params.toString()}`);
  };
  return (
    <FormControl
      sx={{
        width: 300,
      }}
    >
      <InputLabel id="sort-select-label" size="small">
        Sắp xếp theo
      </InputLabel>
      <Select
        labelId="sort-select-label"
        id="sort-select"
        size="small"
        value={defaultSort}
        label="Sắp xếp theo"
        onChange={onChange}
      >
        <MenuItem value="default">Mặc định</MenuItem>
        <MenuItem value="price_asc">Giá: Thấp đến cao</MenuItem>
        <MenuItem value="price_desc">Giá: Cao đến thấp</MenuItem>
        <MenuItem value="newest">Mới nhất</MenuItem>
        <MenuItem value="oldest">Cũ nhất</MenuItem>
      </Select>
    </FormControl>
  );
}
