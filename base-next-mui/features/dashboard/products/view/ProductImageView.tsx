"use client";

import { ImageList, ImageListItem } from "@mui/material";
import Image from "next/image";

type ProductImageViewProps = {
  images: string[];
};

export default function ProductImageView({ images }: ProductImageViewProps) {
  return (
    <ImageList variant="masonry" cols={2} gap={8}>
      {images.map((imgUrl) => (
        <ImageListItem key={imgUrl}>
          <Image
            src={imgUrl}
            alt="Product image"
            width={300}
            height={300}
            style={{
              width: "100%",
              height: "auto",
              borderRadius: "4px",
            }}
          />
        </ImageListItem>
      ))}
    </ImageList>
  );
}