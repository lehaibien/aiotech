"use client";

import useCart from "@/hooks/useCart";
import { UUID } from "@/types";
import { Button } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {ShoppingCart} from 'lucide-react';

type AddToCartButtonProps = {
  productId: UUID;
  productName: string;
  productPrice: number;
  productImage: string;
};

export const AddToCartButton = ({
  productId,
  productName,
  productPrice,
  productImage,
}: AddToCartButtonProps) => {
  const { addToCart } = useCart();
  const handleAddToCart = () => {
    addToCart({
      productId: productId,
      productName: productName,
      productPrice: productPrice,
      productImage: productImage,
      quantity: 1,
    });
    notifications.show({
      message: "Thêm vào giỏ hàng thành công",
      color: "green",
    });
  };
  return (
    <Button
      variant="filled"
      leftSection={<ShoppingCart />}
      data-umami-event="Thêm vào giỏ hàng"
      size="sm"
      onClick={handleAddToCart}
    >
      Thêm vào giỏ hàng
    </Button>
  );
};
