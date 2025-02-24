import { formatNumberWithSeperator } from '@/lib/utils';
import { CartItemResponse } from '@/types';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import {
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import Image from 'next/image';

type CartItemListingProps = {
  cartItems: CartItemResponse[];
  onQuantityChange: (cartItem: CartItemResponse) => void;
  onRemoveFromCart: (productId: string) => void;
};

function CartItemListing({
  cartItems,
  onQuantityChange,
  onRemoveFromCart,
}: CartItemListingProps) {
  return (
    <List>
      {cartItems.map((item) => (
        <ListItem
          key={item.productId}
          sx={{ py: 2, px: 0, borderTop: '1px solid #e0e0e0', gap: 2 }}
        >
          <Image
            src={item.productImage ?? ''}
            alt={item.productName ?? ''}
            width={100}
            height={100}
          />
          <ListItemText
            primary={item.productName}
            secondary={formatNumberWithSeperator(item.productPrice ?? 0) + ' đ'}
          />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid #e0e0e0',
                borderRadius: 2,
                padding: '2px 5px',
              }}
            >
              <IconButton
                size='small'
                onClick={() =>
                  item.quantity > 1
                    ? onQuantityChange({
                        ...item,
                        quantity: item.quantity - 1,
                      })
                    : null
                }
                disabled={item.quantity <= 1}
              >
                <RemoveIcon fontSize='small' />
              </IconButton>
              <Typography sx={{ mx: 1 }}>{item.quantity}</Typography>
              <IconButton
                size='small'
                onClick={() =>
                  onQuantityChange({
                    ...item,
                    quantity: item.quantity + 1,
                  })
                }
              >
                <AddIcon fontSize='small' />
              </IconButton>
            </Box>
            <Box sx={{ width: '100%', mt: 0.5 }}>
              <Button
                onClick={() => onRemoveFromCart(item.productId)}
                sx={{ width: '100%' }}
              >
                <Typography color='error'>Xóa</Typography>
              </Button>
            </Box>
          </Box>
        </ListItem>
      ))}
    </List>
  );
}

export default CartItemListing;
