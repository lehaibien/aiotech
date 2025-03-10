import { GridRenderCellParams } from "@mui/x-data-grid";
import Image from "next/image";

export function ImageRenderer(
  params: GridRenderCellParams<{ imageUrl: string; title: string }>
) {
  return (
    <Image
      src={params.row.imageUrl ?? "/image-not-found.jpg"}
      alt={`${params.row.title}`}
      width={300}
      height={0}
      style={{
        width: "auto",
        height: "auto",
        aspectRatio: 16 / 9,
      }}
    />
  );
}
