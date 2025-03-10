import { GridRenderCellParams } from '@mui/x-data-grid';
import Image from 'next/image';

export default function BrandImageRenderer(
  params: GridRenderCellParams<{ imageUrl: string; name: string }>
) {
  return (
    <Image
      src={params.row.imageUrl ?? '/image-not-found.jpg'}
      alt={`${params.row.name}`}
      width={300}
      height={0}
      style={{
        width: 'auto',
        height: 'auto',
        aspectRatio: 4 / 3,
        objectFit: 'contain',
      }}
    />
  );
}
