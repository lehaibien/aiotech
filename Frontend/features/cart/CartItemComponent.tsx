import { formatNumberWithSeperator } from '@/lib/utils';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import {
  Box,
  Button,
  IconButton,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import { UUID } from "@/types";
import Image from 'next/image';

type CartItemProps = {
  id: UUID;
  name: string;
  image: string;
  price: number;
  quantity: number;
  onQuantityChange: (id: UUID, quantity: number) => void;
  onRemoveFromCart: (id: UUID) => void;
};

function CartItemComponent({
  id,
  name,
  image,
  price,
  quantity,
  onQuantityChange,
  onRemoveFromCart,
}: CartItemProps) {
  return (
    <ListItem
      key={id}
      sx={{ py: 2, px: 0, borderTop: '1px solid #e0e0e0', gap: 2 }}
    >
      <Image src={image} alt={name} width={100} height={100} />
      <ListItemText
        primary={name}
        secondary={formatNumberWithSeperator(price) + ' đ'}
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
            onClick={() => (quantity > 1 ? onQuantityChange(id, -1) : null)}
            disabled={quantity <= 1}
          >
            <RemoveIcon fontSize='small' />
          </IconButton>
          <Typography sx={{ mx: 1 }}>{quantity}</Typography>
          <IconButton size='small' onClick={() => onQuantityChange(id, 1)}>
            <AddIcon fontSize='small' />
          </IconButton>
        </Box>
        <Box sx={{ width: '100%', mt: 0.5 }}>
          <Button onClick={() => onRemoveFromCart(id)} sx={{ width: '100%' }}>
            <Typography color='error'>Xóa</Typography>
          </Button>
        </Box>
      </Box>
    </ListItem>
  );
}

export default CartItemComponent;
