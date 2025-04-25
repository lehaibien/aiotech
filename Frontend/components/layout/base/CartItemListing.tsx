'use client'

import useCart from "@/hooks/useCart";
import { formatNumberWithSeperator } from "@/lib/utils";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import {
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  Stack,
  SxProps,
  Typography,
} from "@mui/material";
import Image from "next/image";

type CartItemListingProps = {
  sx?: SxProps;
};

export const CartItemListing = ({ sx }: CartItemListingProps) => {
  const { cartItems, addToCart, removeFromCart } = useCart();
  return (
    <List sx={{ ...sx, p: 0 }}>
      {cartItems.map((item) => (
        <ListItem
          key={item.productId}
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
          }}
        >
          <Image
            src={item.productImage || "/placeholder-product.png"}
            alt={item.productName}
            width={96}
            height={96}
          />

          <Box>
            <Typography>{item.productName}</Typography>
            <Typography variant="body2" color="textSecondary">
              {formatNumberWithSeperator(item.productPrice ?? 0)}₫
            </Typography>
          </Box>

          <Stack marginX="auto" alignItems="center">
            <Stack direction="row" alignItems="center">
              <IconButton
                size="small"
                onClick={() =>
                  item.quantity > 1 &&
                  addToCart({ ...item, quantity: item.quantity - 1 })
                }
                disabled={item.quantity <= 1}
                sx={{ bgcolor: "action.hover", borderRadius: 1 }}
              >
                <RemoveIcon fontSize="inherit" />
              </IconButton>

              <Typography
                variant="body2"
                sx={{ minWidth: 24, textAlign: "center" }}
              >
                {item.quantity}
              </Typography>

              <IconButton
                size="small"
                onClick={() =>
                  addToCart({ ...item, quantity: item.quantity + 1 })
                }
              >
                <AddIcon fontSize="inherit" />
              </IconButton>
            </Stack>

            <Button
              variant="text"
              size="small"
              color="error"
              onClick={() => removeFromCart(item.productId)}
            >
              Xóa
            </Button>
          </Stack>
        </ListItem>
      ))}
    </List>
  );
};
