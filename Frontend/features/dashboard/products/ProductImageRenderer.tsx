"use client";

import { GridRenderCellParams } from "@mui/x-data-grid";
import Image from "next/image";

export default function ProductImageRenderer(
  params: GridRenderCellParams<{ imageUrls: string[]; sku: string }>
) {
  return (
    <Image
      src={
        params.row.imageUrls?.length > 0
          ? params.row.imageUrls[0]
          : "/image-not-found.jpg"
      }
      alt={params.row.sku}
      width={300}
      height={0}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        aspectRatio: 1 / 1,
      }}
    />
  );
}
