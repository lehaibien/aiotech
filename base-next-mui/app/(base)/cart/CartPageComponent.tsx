"use client";

import { TAX_VALUE } from "@/constant/common";
import useCart from "@/hooks/useCart";
import { formatNumberWithSeperator } from "@/lib/utils";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import RemoveIcon from "@mui/icons-material/Remove";
import {
  Box,
  Button,
  Container,
  Grid2 as Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";

export default function CartPageComponent() {
  const { cartItems, addToCart, removeFromCart } = useCart();

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.productPrice || 0) * item.quantity,
    0
  );
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h5" gutterBottom>
        Giỏ hàng
      </Typography>

      <Grid container spacing={4}>
        {/* Cart Items */}
        <Grid size={{ xs: 12, md: 8 }}>
          {cartItems.map((item) => (
            <Grid
              container
              key={item.productId}
              spacing={2}
              sx={{ py: 3, borderBottom: 1, borderColor: "divider" }}
            >
              {/* Product Image */}
              <Grid size={{ xs: 4, md: 2 }}>
                <Box sx={{ position: "relative", aspectRatio: "1/1" }}>
                  <Image
                    src={item.productImage || "/placeholder-product.jpg"}
                    alt={item.productName}
                    fill
                    style={{ objectFit: "contain" }}
                  />
                </Box>
              </Grid>

              {/* Product Info */}
              <Grid size={{ xs: 8, md: 6 }}>
                <Typography variant="body1" gutterBottom>
                  {item.productName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatNumberWithSeperator(item.productPrice || 0)} đ
                </Typography>
              </Grid>

              {/* Quantity Controls */}
              <Grid size={{ xs: 6, md: 2 }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <IconButton
                    size="small"
                    onClick={() =>
                      addToCart({ ...item, quantity: item.quantity - 1 })
                    }
                    disabled={item.quantity <= 1}
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                  <Typography variant="body1" sx={{ px: 2 }}>
                    {item.quantity}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() =>
                      addToCart({ ...item, quantity: item.quantity + 1 })
                    }
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </Grid>

              {/* Total Price */}
              <Grid size={{ xs: 6, md: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body1" fontWeight="bold">
                    {formatNumberWithSeperator(
                      (item.productPrice || 0) * item.quantity
                    )}{" "}
                    đ
                  </Typography>
                  <IconButton
                    onClick={() => removeFromCart(item.productId)}
                    color="error"
                  >
                    <DeleteOutlineIcon />
                  </IconButton>
                </Box>
              </Grid>
            </Grid>
          ))}
        </Grid>

        {/* Order Summary */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Box sx={{ p: 3, bgcolor: "background.paper", borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Thông tin
            </Typography>

            <Stack
              direction="row"
              justifyContent="space-between"
              sx={{ mb: 3 }}
            >
              <Typography variant="h6">Thuế GTGT</Typography>
              <Typography variant="h6" color="primary">
                {formatNumberWithSeperator(subtotal * TAX_VALUE)} đ
              </Typography>
            </Stack>

            <Stack
              direction="row"
              justifyContent="space-between"
              sx={{ mb: 3 }}
            >
              <Typography variant="h6">Tổng thanh toán</Typography>
              <Typography variant="h6" color="primary">
                {formatNumberWithSeperator(subtotal)} đ
              </Typography>
            </Stack>

            <Button
              variant="contained"
              LinkComponent={Link}
              href="/checkout"
              size="large"
              fullWidth
              disabled={cartItems.length === 0}
              data-umami-event="Tiến hành thanh toán"
            >
              Thanh toán
            </Button>
          </Box>
        </Grid>
      </Grid>

      {cartItems.length === 0 && (
        <Typography variant="body1" textAlign="center" sx={{ py: 8 }}>
          Giỏ hàng trống
        </Typography>
      )}
    </Container>
  );
}
