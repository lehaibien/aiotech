"use client";

import { LOW_STOCK_THRESHOLD } from "@/constant/common";
import useCart from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { formatNumberWithSeperator } from "@/lib/utils";
import { ProductListItemResponse } from "@/types";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Rating,
  Stack,
  Typography,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useSnackbar } from "notistack";

type ProductCardProps = {
  product: ProductListItemResponse;
};

export const ProductCard = ({ product }: ProductCardProps) => {
  const { id, name, brand, price, discountPrice, rating, thumbnailUrl, stock } =
    product;
  const { enqueueSnackbar } = useSnackbar();
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();
  const discountPercent =
    discountPrice && ((1 - discountPrice / price) * 100).toFixed(0);

  const handleAddToCartClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (stock > 0) {
      addToCart({
        productId: id,
        productName: name,
        productPrice: discountPrice ?? price,
        productImage: thumbnailUrl,
        quantity: 1,
      });
      enqueueSnackbar("Đã thêm sản phẩm vào giỏ hàng", { variant: "success" });
      return;
    }
    enqueueSnackbar("Sản phẩm đã hết hàng", { variant: "error" });
  };

  const handleAddToWishlistClick = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();
    const message = await addToWishlist(id);
    if (message === "") {
      enqueueSnackbar("Đã thêm sản phẩm vào danh sách yêu thích", {
        variant: "success",
      });
    } else {
      enqueueSnackbar(message, { variant: "error" });
    }
  };

  const getStockColor = () => {
    if (stock <= 0) return "error";
    if (stock <= LOW_STOCK_THRESHOLD) return "warning";
    return "success";
  };

  const getStockText = () => {
    if (stock <= 0) return "Hết hàng";
    if (stock <= LOW_STOCK_THRESHOLD) return "Sắp hết hàng";
    return "Còn hàng";
  };
  return (
    <Card
      component={Link}
      href={`/products/${id}`}
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {stock <= LOW_STOCK_THRESHOLD && (
        <Chip
          label={getStockText()}
          color={getStockColor()}
          size="small"
          sx={{
            position: "absolute",
            top: 8,
            left: 8,
            zIndex: 1,
            fontWeight: 600,
          }}
        />
      )}
      <CardMedia
        sx={{
          position: "relative",
          height: 300,
          display: "flex",
          backgroundColor: "background.default",
          border: "1px solid",
          borderBottom: "none",
          borderColor: "background.paper",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <Image
          src={thumbnailUrl}
          height={300}
          width={300}
          alt={name}
          style={{
            objectFit: "contain",
          }}
        />
        {product.discountPrice && (
          <Chip
            label={discountPercent + "%"}
            color="error"
            size="small"
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
            }}
          />
        )}
      </CardMedia>
      <CardContent
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          gap: 1,
          px: 2,
          py: 0,
        }}
      >
        <Box>
          <Typography variant="overline" color="primary" noWrap>
            {brand}
          </Typography>
          <Typography
            variant="body1"
            component="h3"
            sx={{
              fontWeight: 600,
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {name}
          </Typography>
        </Box>
        <Stack spacing={1}>
          {discountPrice ? (
            <div>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  lineHeight: 1,
                  textDecoration: "line-through",
                  whiteSpace: "nowrap",
                }}
              >
                {formatNumberWithSeperator(price)} đ
              </Typography>
              <Typography variant="h6" fontWeight={600} color="error" noWrap>
                {formatNumberWithSeperator(discountPrice)} đ
              </Typography>
            </div>
          ) : (
            <Typography variant="h6" fontWeight={600} color="error" noWrap>
              {formatNumberWithSeperator(price)} đ
            </Typography>
          )}
          <Stack direction="row" alignItems="center">
            <Rating value={rating} precision={0.1} size="small" readOnly />
            <Typography variant="caption" color="text.secondary">
              ({rating.toFixed(1)})
            </Typography>
          </Stack>
          <Stack
            direction="row"
            alignItems="center"
            sx={{
              mt: "auto",
              gap: 1,
            }}
          >
            <Button
              fullWidth
              variant="contained"
              color="primary"
              size="small"
              disabled={stock <= 0}
              onClick={handleAddToCartClick}
              data-umami-event="Thêm vào giỏ hàng"
            >
              <AddShoppingCartIcon fontSize="medium" sx={{ mr: 1 }} />
              Thêm vào giỏ
            </Button>
            <Button
              variant="contained"
              color="secondary"
              size="small"
              onClick={handleAddToWishlistClick}
              data-umami-event="Yêu thích sản phẩm"
            >
              <FavoriteBorderIcon fontSize="medium" />
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};
