import { formatNumberWithSeperator } from '@/lib/utils';
import { CartItemResponse } from '@/types';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Box, IconButton, List, ListItem, Typography, Stack, SxProps } from '@mui/material';
import Image from 'next/image';

type CartItemListingProps = {
  cartItems: CartItemResponse[];
  onQuantityChange: (cartItem: CartItemResponse) => void;
  onRemoveFromCart: (productId: string) => void;
  sx?: SxProps;
};

function CartItemListing({ cartItems, onQuantityChange, onRemoveFromCart, sx }: CartItemListingProps) {
  return (
    <List sx={{ ...sx, p: 0 }}>
      {cartItems.map((item) => (
        <ListItem
          key={item.productId}
          sx={{
            px: 2,
            py: 1.5,
            display: 'flex',
            gap: 2,
            alignItems: 'center',
            borderBottom: 1,
            borderColor: 'divider',
            '&:last-child': { borderBottom: 0 }
          }}
        >
          <Box sx={{ flexShrink: 0, position: 'relative', width: 64, height: 64 }}>
            <Image
              src={item.productImage || '/placeholder-product.png'}
              alt={item.productName}
              fill
              style={{ objectFit: 'cover', borderRadius: 4 }}
            />
          </Box>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" fontWeight={500} noWrap>
              {item.productName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {formatNumberWithSeperator(item.productPrice ?? 0)}₫
            </Typography>
          </Box>

          <Stack alignItems="center" gap={0.5}>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <IconButton
                size="small"
                onClick={() => item.quantity > 1 && onQuantityChange({ ...item, quantity: item.quantity - 1 })}
                disabled={item.quantity <= 1}
                sx={{ bgcolor: 'action.hover', borderRadius: 1 }}
              >
                <RemoveIcon fontSize="inherit" />
              </IconButton>
              
              <Typography variant="body2" sx={{ minWidth: 24, textAlign: 'center' }}>
                {item.quantity}
              </Typography>
              
              <IconButton
                size="small"
                onClick={() => onQuantityChange({ ...item, quantity: item.quantity + 1 })}
                sx={{ bgcolor: 'action.hover', borderRadius: 1 }}
              >
                <AddIcon fontSize="inherit" />
              </IconButton>
            </Stack>
            
            <Typography
              variant="caption"
              color="error.main"
              onClick={() => onRemoveFromCart(item.productId)}
              sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
            >
              Xóa
            </Typography>
          </Stack>
        </ListItem>
      ))}
    </List>
  );
}

export default CartItemListing;
