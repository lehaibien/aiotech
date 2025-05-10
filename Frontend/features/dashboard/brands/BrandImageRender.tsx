import { IMAGE_ASPECT_RATIO, IMAGE_PLACEHOLDER } from "@/constant/image";
import { BrandResponse } from "@/types";
import Image from "next/image";

export const BrandImageRender = (record: BrandResponse) => {
  return (
    <Image
      src={record.imageUrl ?? IMAGE_PLACEHOLDER.DEFAULT}
      alt={record.name}
      width={300}
      height={200}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "fill",
        aspectRatio: IMAGE_ASPECT_RATIO.BRANDING,
        backgroundColor: 'white',
      }}
    />
  );
};
