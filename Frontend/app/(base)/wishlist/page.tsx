import { WishlistGrid } from '@/features/wishlist/WishlistGrid';
import { Divider, Stack, Typography } from '@mui/material';

export default function Page() {
  return (
    <Stack spacing={1}>
      <Typography
        variant='h3'
        component='h1'>
        Danh sách yêu thích
      </Typography>
      <Typography
        variant='body1'
        color='textDisabled'>
        Danh sách yêu thích của bạn sẽ giúp bạn theo dõi những sản phẩm mà bạn
        quan tâm nhất.
      </Typography>
      <Divider />
      <WishlistGrid />
    </Stack>
  );
}
