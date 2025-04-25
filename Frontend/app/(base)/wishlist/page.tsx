import { WishlistGrid } from '@/features/wishlist/WishlistGrid';
import { Divider, Stack, Typography } from '@mui/material';

/**
 * Renders the wishlist page with a heading, description, and a grid of favorite items.
 *
 * Displays a styled layout containing the wishlist title, explanatory text, a divider, and the user's wishlist items.
 */
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
