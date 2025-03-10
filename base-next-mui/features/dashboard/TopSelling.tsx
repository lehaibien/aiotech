"use client";

import { ProductResponse } from "@/types";
import { List, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import Image from "next/image";

type TopSellingProps = {
  data: ProductResponse[];
};

export function TopSelling({ data }: TopSellingProps) {
  return (
    <List>
      {data.map((product) => (
        <ListItem key={product.id}>
          <ListItemAvatar>
            <Image
              src={product.imageUrls[0]}
              alt={product.name}
              width={50}
              height={50}
            />
          </ListItemAvatar>
          <ListItemText primary={product.name} secondary={`Sales: 555`} />
        </ListItem>
      ))}
    </List>
  );
}
