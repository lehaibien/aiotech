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
      <IconButton color="inherit" onClick={onOpen}>
        <Badge badgeContent={cartItems.length} color="error">
          <ShoppingBagOutlinedIcon />
        </Badge>
      </IconButton>

      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: 360, lg: 400 },
          },
        }}
      >
        <Box
          sx={{
            p: 2,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <Typography variant="h6">{cartItems.length} sản phẩm</Typography>
              <IconButton onClick={onClose}>
                <CloseIcon />
              </IconButton>
            </Box>
            <CartItemListing
              cartItems={cartItems}
              onQuantityChange={addToCart}
              onRemoveFromCart={removeFromCart}
            />
          </Box>

          <Box>
            <Button
              onClick={() => handleNavigation("/checkout")}
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              Thanh toán ngay{" "}
              {cartItems.length > 0 &&
                "(" +
                  formatNumberWithSeperator(
                    cartItems.reduce(
                      (acc, cur) =>
                        acc + (cur.productPrice ?? 0) * cur.quantity,
                      0
                    )
                  ) +
                  " đ)"}
            </Button>
            <Button
              onClick={() => handleNavigation("/cart")}
              variant="outlined"
              color="primary"
              fullWidth
              sx={{ mt: 1 }}
            >
              Xem giỏ hàng
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
