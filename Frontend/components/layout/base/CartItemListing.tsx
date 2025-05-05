"use client";

import useCart from "@/hooks/useCart";
import { formatNumberWithSeperator } from "@/lib/utils";
import { ActionIcon, Group, Stack, Text } from "@mantine/core";
import { Minus, Plus, Trash } from "lucide-react";

import Image from "next/image";

export const CartItemListing = () => {
  const { cartItems, addToCart, removeFromCart } = useCart();
  return (
    <Stack>
      {cartItems.map((item) => (
        <Group key={item.productId} align="center" wrap="nowrap">
          <Image
            src={item.productImage || "/placeholder-product.png"}
            alt={item.productName}
            width={96}
            height={96}
          />
          <Stack gap='sm' flex={1}>
            <Text size="sm" lineClamp={2}>
              {item.productName}
            </Text>
            <Text size="xs">
              {formatNumberWithSeperator(item.productPrice ?? 0)}₫
            </Text>
          </Stack>

          <Group wrap="nowrap" gap={12} style={{
            justifySelf: "flex-end",
          }}>
            <ActionIcon
              size="sm"
              onClick={() =>
                item.quantity > 1 &&
                addToCart({ ...item, quantity: item.quantity - 1 })
              }
              disabled={item.quantity <= 1}
            >
              <Minus />
            </ActionIcon>

            <Text>{item.quantity}</Text>

            <ActionIcon
              size="sm"
              onClick={() =>
                addToCart({ ...item, quantity: item.quantity + 1 })
              }
            >
              <Plus />
            </ActionIcon>
            <ActionIcon
              variant="transparent"
              size="sm"
              color="red"
              onClick={() => removeFromCart(item.productId)}
            >
              <Trash />
            </ActionIcon>
          </Group>
        </Group>
      ))}
    </Stack>
  );
};
