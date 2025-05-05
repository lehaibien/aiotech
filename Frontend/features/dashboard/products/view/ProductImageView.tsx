"use client";

import { SimpleGrid } from "@mantine/core";
import Image from "next/image";

type ProductImageViewProps = {
  imageUrls: string[];
};

export const ProductImageView = ({ imageUrls }: ProductImageViewProps) => {
  return (
    <SimpleGrid cols={2}>
      {imageUrls.map((url) => (
        <Image
          key={url}
          src={url}
          alt="Product image"
          width={300}
          height={300}
          style={{
            width: "100%",
            height: "auto",
            backgroundColor: 'white',
            padding: 'var(--mantine-spacing-xs)'
          }}
        />
      ))}
    </SimpleGrid>
  );
};
