import { Rating } from '@mui/material';
import { GridRenderCellParams } from '@mui/x-data-grid';

export default function ReviewRatingRenderer(
  params: GridRenderCellParams<{ rating: number }>
) {
  return <Rating value={params.row.rating} readOnly />;
}
