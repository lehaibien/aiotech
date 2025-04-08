"use client";

import { DashboardTopProduct } from "@/types";
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import Image from "next/image";

type TopSellingProps = {
  data: DashboardTopProduct[];
};

export function TopSelling({ data }: TopSellingProps) {
  if (data.length == 0) {
    return (
      <Typography
        variant="body1"
        sx={{
          textAlign: "center",
          color: "text.secondary",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        Không có dữ liệu
      </Typography>
    );
  }
  return (
    <List>
      {data.map((prd) => (
        <ListItem key={prd.id}>
          <ListItemAvatar>
            <Image
              src={prd.imageUrls[0]}
              alt={prd.name}
              width={100}
              height={100}
              style={{ objectFit: "contain" }}
            />
          </ListItemAvatar>
          <ListItemText
            primary={prd.name}
            secondary={`Số lượng: ${prd.sales}`}
          />
        </ListItem>
      ))}
    </List>
  );
}
