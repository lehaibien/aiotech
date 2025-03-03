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
  Chip,
  Rating,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useSnackbar } from "notistack";
import { memo, useState } from "react";
import useCart from "../../hooks/useCart";

interface ProductCardProps {
  product: ProductResponse;
}

function ProductCard({ product }: ProductCardProps) {
  const theme = useTheme();
  const {
    id,
    name,
    imageUrls: thumbnails,
    brand,
    price,
    rating,
    stock,
  } = product;
  const { enqueueSnackbar } = useSnackbar();
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [currentImage, setCurrentImage] = useState(thumbnails[0]);

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
        borderRadius: 2,
        boxShadow: isHovered ? theme.shadows[8] : theme.shadows[1],
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-8px)",
        },
        cursor: "pointer",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {stock <= 10 && (
        <Chip
          label={getStockText()}
          color={getStockColor()}
          size="small"
          sx={{
            position: "absolute",
            top: 10,
            left: 10,
            zIndex: 1,
          }}
        />
      )}
      <CardMedia
        sx={{
          position: "relative",
          height: 220,
          backgroundColor: alpha(theme.palette.primary.light, 0.05),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <Image
          src={currentImage}
          height={180}
          width={180}
          alt={name}
          style={{
            objectFit: "contain",
            transition: "transform 0.5s ease",
            transform: isHovered ? "scale(1.1)" : "scale(1)",
          }}
          placeholder="blur"
          blurDataURL={currentImage}
        />
      </CardMedia>
      <CardContent
        sx={{
          flexGrow: 1,
          p: 2,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          gap: 1.5,
        }}
      >
        <Box>
          <Typography
            variant="caption"
            noWrap
            sx={{
              color: theme.palette.primary.main,
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
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
              WebkitLineClamp: "2",
              WebkitBoxOrient: "vertical",
              minHeight: "48px",
              mt: 0.5,
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
            mb={1}
          >
            <Typography
              variant="h6"
              fontWeight="bold"
              color="error"
              sx={{
                fontSize: "1.1rem",
              }}
            >
              {formatNumberWithSeperator(price)} đ
            </Typography>
            <Box display="flex" alignItems="center" gap={0.5}>
              <Rating
                name="product-rating"
                value={rating}
                size="small"
                precision={0.5}
                readOnly
              />
              <Typography variant="caption" color="text.secondary">
                ({rating})
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Button
              color="primary"
              variant="contained"
              size="small"
              disabled={stock <= 0}
              sx={{
                borderRadius: "20px",
                textTransform: "none",
                flex: 2,
                boxShadow: 2,
                fontWeight: 600,
                "&:hover": {
                  boxShadow: 4,
                },
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
  return (
    prev.product.id === next.product.id &&
    prev.product.stock === next.product.stock &&
    prev.product.price === next.product.price
  );
});
