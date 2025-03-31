"use client";

import useCart from "@/hooks/useCart";
import { formatNumberWithSeperator } from "@/lib/utils";
import { ProductResponse } from "@/types";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
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
  useTheme,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useSnackbar } from "notistack";
import { memo, useState } from "react";

type ProductCardProps = {
  product: ProductResponse;
};

function ProductCard({ product }: ProductCardProps) {
  const theme = useTheme();
  const {
    id,
    name,
    imageUrls: thumbnails,
    brand,
    price,
    discountPrice,
    rating,
    stock,
  } = product;
  const { enqueueSnackbar } = useSnackbar();
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [currentImage, setCurrentImage] = useState(thumbnails[0]);
  const primary = theme.palette.primary;

  const handleAddToCartClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (stock > 0) {
      addToCart({
        productId: id,
        productName: name,
        productPrice: price,
        productImage: thumbnails[0],
        quantity: 1,
      });
      enqueueSnackbar("Đã thêm sản phẩm vào giỏ hàng", { variant: "success" });
      return;
    }
    enqueueSnackbar("Sản phẩm đã hết hàng", { variant: "error" });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (thumbnails.length > 1) {
      setCurrentImage(thumbnails[1]);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setCurrentImage(thumbnails[0]);
  };

  const getStockColor = () => {
    if (stock <= 0) return "error";
    if (stock <= 10) return "warning";
    return "success";
  };

  const getStockText = () => {
    if (stock <= 0) return "Hết hàng";
    if (stock <= 10) return "Sắp hết hàng";
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
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: `0 4px 16px rgba(${parseInt(
            primary.main.slice(1, 3),
            16
          )}, ${parseInt(primary.main.slice(3, 5), 16)}, ${parseInt(
            primary.main.slice(5, 7),
            16
          )}, 0.2)`,
        },
        cursor: "pointer",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Stock status chip */}
      {stock <= 10 && (
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
      {/* Product image */}
      <CardMedia
        sx={{
          position: "relative",
          height: 220,
          bgcolor: "background.paper",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <Image
          src={currentImage}
          height={200}
          width={200}
          alt={name}
          style={{
            objectFit: "contain",
            transition: "transform 0.3s ease",
            transform: isHovered ? "scale(1.05)" : "scale(1)",
          }}
          placeholder="blur"
          blurDataURL={currentImage}
        />
        {product.discountPrice && (
          <Chip
            label={`-${Math.round(
              (1 - product.discountPrice / product.price) * 100
            )}%`}
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
          p: 2,
        }}
      >
        {/* Brand and product name */}
        <Box>
          <Typography
            variant="overline"
            color="primary"
            fontWeight="bold"
            display="block"
            noWrap
          >
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
              lineHeight: 1.25,
            }}
          >
            {name}
          </Typography>
        </Box>
        {/* Pricing and actions */}
        <Stack gap={0.5}>
          {/* Price display */}
            {discountPrice ? (
              <>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    textDecoration: "line-through",
                    whiteSpace: "nowrap",
                  }}
                >
                  {formatNumberWithSeperator(price)} đ
                </Typography>
                <Typography variant="h6" fontWeight="bold" color="error">
                  {formatNumberWithSeperator(discountPrice)} đ
                </Typography>
              </>
            ) : (
              <Typography variant="h6" fontWeight="bold" color="error" noWrap>
                {formatNumberWithSeperator(price)} đ
              </Typography>
            )}
          {/* Rating */}
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Rating
              value={rating}
              precision={0.1}
              size="small"
              readOnly
              sx={{ "& .MuiRating-icon": { fontSize: "1rem" } }}
            />
            <Typography variant="caption" color="text.secondary">
              ({rating.toFixed(1)})
            </Typography>
          </Stack>
          {/* Add to cart button */}
          <Button
            fullWidth
            variant="contained"
            color="primary"
            size="small"
            disabled={stock <= 0}
            startIcon={<AddShoppingCartIcon fontSize="small" />}
            onClick={handleAddToCartClick}
            data-umami-event="Thêm vào giỏ hàng"
            sx={{
              fontWeight: 700,
              py: 1,
              width: "80%",
              "& .MuiButton-startIcon": { mr: 0.5 },
            }}
          >
            Thêm vào giỏ hàng
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default memo(
  ProductCard,
  (prev, next) => JSON.stringify(prev.product) === JSON.stringify(next.product)
);
