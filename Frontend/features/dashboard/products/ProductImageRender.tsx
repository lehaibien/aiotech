import { IMAGE_ASPECT_RATIO } from "@/constant/imageAspectRatio";
import { ProductResponse } from "@/types";
import Image from "next/image";

export const ProductImageRender = (record: ProductResponse) => {
  return (
    <Image
      src={
        record.imageUrls?.length > 0
          ? record.imageUrls[0]
          : "/image-not-found.jpg"
      }
      alt={record.name}
      width={200}
      height={200}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "fill",
        aspectRatio: IMAGE_ASPECT_RATIO.PRODUCT,
      }}
    />
  );
};
