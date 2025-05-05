"use client";

import { LOW_STOCK_THRESHOLD } from "@/constant/common";
import useCart from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { formatNumberWithSeperator } from "@/lib/utils";
import { ProductListItemResponse } from "@/types";
import {
  Badge,
  Button,
  Card,
  Group,
  Rating,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { Heart, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type ProductCardProps = {
  product: ProductListItemResponse;
};

export const ProductCard = ({ product }: ProductCardProps) => {
  const { id, name, brand, price, discountPrice, rating, thumbnailUrl, stock } =
    product;
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
      notifications.show({
        message: "Đã thêm sản phẩm vào giỏ hàng",
        color: "green",
      });
      return;
    }
    notifications.show({
      message: "Sản phẩm đã hết hàng",
      color: "red",
    });
  };

  const handleAddToWishlistClick = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();
    const message = await addToWishlist(id);
    if (message === "") {
      notifications.show({
        message: "Đã thêm sản phẩm vào danh sách yêu thích",
        color: "green",
      });
    } else {
      notifications.show({
        message: message,
        color: "red",
      });
    }
  };

  const getStockColor = () => {
    if (stock <= 0) return "red";
    if (stock <= LOW_STOCK_THRESHOLD) return "orange";
    return "green";
  };

  const getStockText = () => {
    if (stock <= 0) return "Hết hàng";
    if (stock <= LOW_STOCK_THRESHOLD) return "Sắp hết hàng";
    return "Còn hàng";
  };
  return (
    <Card component={Link} href={`/products/${id}`} withBorder>
      <Card.Section pos="relative">
        <Image
          src={thumbnailUrl}
          width={300}
          height={300}
          alt={name}
          style={{
            objectFit: "contain",
          }}
        />
        {stock <= LOW_STOCK_THRESHOLD && (
          <Badge
            color={getStockColor()}
            variant="filled"
            pos="absolute"
            top={8}
            left={8}
          >
            {getStockText()}
          </Badge>
        )}
        {discountPrice && (
          <Badge color="red" variant="filled" pos="absolute" top={8} right={8}>
            -{discountPercent + "%"}
          </Badge>
        )}
      </Card.Section>
      <Stack gap="xs">
        <Text size="sm" c="blue" fw={600} tt="uppercase">
          {brand}
        </Text>
        <Title order={6} lineClamp={2}>
          {name}
        </Title>
        {discountPrice ? (
          <Stack gap={0}>
            <Text size="sm" c="gray" fw={600} td="line-through">
              {formatNumberWithSeperator(price)} đ
            </Text>
            <Text size="md" c="red" fw={600}>
              {formatNumberWithSeperator(discountPrice)} đ
            </Text>
          </Stack>
        ) : (
          <Text size="sm" c="red" fw={600}>
            {formatNumberWithSeperator(price)} đ
          </Text>
        )}
        <Group gap='sm'>
          <Rating value={rating} readOnly />
          <Text size="sm" c="gray" tt="uppercase">
            ({rating.toFixed(1)})
          </Text>
        </Group>
        <Group justify="space-between" align="center" mt="auto" gap='sm'>
          <Button
            flex={1}
            variant="filled"
            size="compact-md"
            disabled={stock <= 0}
            onClick={handleAddToCartClick}
            data-umami-event="Thêm vào giỏ hàng"
            leftSection={<ShoppingCart />}
          >
            Thêm vào giỏ
          </Button>
          <Button
            variant="filled"
            color="pink"
            size="compact-md"
            onClick={handleAddToWishlistClick}
            data-umami-event="Yêu thích sản phẩm"
          >
            <Heart />
          </Button>
        </Group>
      </Stack>
    </Card>
  );
};
