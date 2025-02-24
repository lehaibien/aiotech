"use client";

import { formatNumberWithSeperator } from "@/lib/utils";
import { ProductResponse } from "@/types";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useSnackbar } from "notistack";
import { memo } from "react";
import useCart from "../../hooks/useCart";

interface ProductCardProps {
  product: ProductResponse;
}

function ProductCard({ product }: ProductCardProps) {
  const {
    id,
    name,
    imageUrls: thumbnail,
    brand,
    price,
    rating,
    stock,
  } = product;
  const { enqueueSnackbar } = useSnackbar();
  const { addToCart } = useCart();
  const handleAddToCartClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (stock > 1) {
      addToCart({
        productId: id,
        productName: name,
        productPrice: price,
        productImage: thumbnail[0],
        quantity: 1,
      });
      return;
    }
    enqueueSnackbar("Sản phẩm đã hết hàng", { variant: "error" });
  };
  return (
    <Card
      component={Link}
      href={`/products/${id}`}
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
        height: "100%",
        transition: "transform 0.15s ease-in-out",
        "&:hover": {
          transform: "scale(1.03)",
        },
        cursor: "pointer",
      }}
    >
      <CardMedia>
        <Image
          src={thumbnail[0]}
          height={200}
          width={200}
          alt={name}
          style={{
            objectFit: "cover",
            margin: "auto",
          }}
          blurDataURL={thumbnail[0]}
        />
      </CardMedia>
      <CardContent
        sx={{
          flexGrow: 1,
          p: 1.5,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography
            variant="caption"
            noWrap
            sx={(theme) => ({
              color: theme.palette.grey[600],
            })}
          >
            {brand}
          </Typography>
          <Typography
            variant="body1"
            component="h3"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: "2",
              WebkitBoxOrient: "vertical",
            }}
          >
            {name}
          </Typography>
        </Box>
        <Box>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="body1" fontWeight="bold" color="error">
              {formatNumberWithSeperator(price)} đ
            </Typography>
            <Rating
              name="product-rating"
              value={rating}
              size="small"
              readOnly
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Typography
              variant="caption"
              color={
                stock > 0
                  ? stock > 10
                    ? "success.dark"
                    : "warning.dark"
                  : "error.dark"
              }
              sx={{
                flex: 1,
              }}
            >
              {stock > 0
                ? stock > 10
                  ? "Còn hàng"
                  : "Sắp hết hàng"
                : "Hết hàng"}
            </Typography>
            <Button
              color="primary"
              variant="outlined"
              size="small"
              sx={{
                borderWidth: 2,
                textTransform: "initial",
                flex: 2,
              }}
              startIcon={<AddShoppingCartIcon />}
              onClick={handleAddToCartClick}
            >
              Thêm vào giỏ
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default memo(ProductCard, (prev, next) => {
  return prev.product.id === next.product.id;
});
