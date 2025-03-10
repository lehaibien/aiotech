"use client";

import useCart from "@/hooks/useCart";
import { formatNumberWithSeperator, parseUUID } from "@/lib/utils";
import CloseIcon from "@mui/icons-material/Close";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import {
  Badge,
  Box,
  Button,
  Drawer,
  IconButton,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import CartItemListing from "./CartItemListing";
import { cartItemsAtom } from "@/lib/globalState";
import { useSetAtom } from "jotai";
import { useSession } from "next-auth/react";
import { getByIdApi } from "@/lib/apiClient";
import { API_URL } from "@/constant/apiUrl";
import { CartItemResponse } from "@/types";

export function CartDrawer() {
  const router = useRouter();
  const { data: session } = useSession();
  const userId = useMemo(() => session?.user?.id, [session?.user?.id]);
  const setCartItems = useSetAtom(cartItemsAtom);
  const { cartItems, addToCart, removeFromCart } = useCart();
  const [open, setOpen] = useState(false);
  const onOpen = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  const handleNavigation = (url: string) => {
    setOpen(false);
    router.push(url);
  };
  useEffect(() => {
    if (!userId) return;
    const parsedUserId = parseUUID(userId);
    getByIdApi(API_URL.cart, { id: parsedUserId }).then((res) => {
      if (res.success) {
        setCartItems(res.data as CartItemResponse[]);
      }
    });
  }, [setCartItems, userId]);
  return (
    <>
      <IconButton color="inherit" onClick={onOpen} sx={{ p: 1 }}>
        <Badge badgeContent={cartItems.length} color="error">
          <ShoppingBagOutlinedIcon fontSize="small" />
        </Badge>
      </IconButton>

      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {
            width: { xs: '100%', sm: 420, lg: 520 },
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" component="h2">Giỏ hàng</Typography>
          <IconButton onClick={onClose} edge="end" size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <CartItemListing
          cartItems={cartItems}
          onQuantityChange={addToCart}
          onRemoveFromCart={removeFromCart}
          sx={{ flex: 1, overflow: 'auto' }}
        />

        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1.5, borderTop: 1, borderColor: 'divider' }}>
          <Button
            onClick={() => handleNavigation('/checkout')}
            variant="contained"
            color="primary"
            size="medium"
            fullWidth
            sx={{ fontWeight: 600 }}
          >
            Thanh toán ngay
            ({formatNumberWithSeperator(
              cartItems.reduce((acc, cur) => acc + (cur.productPrice ?? 0) * cur.quantity, 0)
            )} ₫)
          </Button>
          
          <Button
            onClick={() => handleNavigation('/cart')}
            variant="outlined"
            color="primary"
            size="medium"
            fullWidth
            sx={{ fontWeight: 500 }}
          >
            Xem chi tiết
          </Button>
        </Box>
      </Drawer>
    </>
  );
}
