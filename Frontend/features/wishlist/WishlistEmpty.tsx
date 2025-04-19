import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Button, Stack, Typography } from '@mui/material';
import Link from 'next/link';

export const WishlistEmpty = () => {
  return (
    <Stack
      spacing={1}
      sx={{
        alignItems: 'center',
        justifyContent: 'center',
        mx: 'auto',
      }}>
      <FavoriteBorderIcon
        fontSize='large'
        sx={{
          color: 'white',
          borderRadius: '50%',
          backgroundColor: 'primary.main',
          opacity: 0.45,
          p: 2,
          width: 96,
          height: 96,
        }}
      />
      <Typography
        variant='h3'
        component='h3'>
        Chưa có sản phẩm nào trong danh sách yêu thích.
      </Typography>
      <Typography
        variant='body1'
        color='textSecondary'>
        Hãy thêm sản phẩm vào danh sách yêu thích để theo dõi nhé!
      </Typography>
      <Button
        variant='contained'
        color='primary'
        component={Link}
        href='/products'>
        Quay lại trang sản phẩm
      </Button>
    </Stack>
  );
};
