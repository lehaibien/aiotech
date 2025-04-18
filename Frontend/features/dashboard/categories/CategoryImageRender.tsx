import { GridRenderCellParams } from '@mui/x-data-grid';
import Image from 'next/image';

export function CategoryImageRender(
  params: GridRenderCellParams<{ imageUrl: string; name: string }>
) {
  return (
    <Image
      src={params.row.imageUrl ?? '/image-not-found.jpg'}
      alt={`${params.row.name}`}
      width={600}
      height={400}
      style={{
        aspectRatio: 3 / 2,
        objectFit: 'fill',
        backgroundColor: 'white',
      }}
    />
  );
}
