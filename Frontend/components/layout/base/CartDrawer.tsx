"use client";

import { API_URL } from "@/constant/apiUrl";
import useCart from "@/hooks/useCart";
import { getByIdApi } from "@/lib/apiClient";
import { cartItemsAtom } from "@/lib/globalState";
import { formatNumberWithSeperator, parseUUID } from "@/lib/utils";
import { CartItemResponse } from "@/types";
import { ActionIcon, Badge, Button, Drawer, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useSetAtom } from "jotai";
import { ShoppingBag } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useMemo } from "react";
import { CartItemListing } from "./CartItemListing";

export const CartDrawer = () => {
  const { data: session } = useSession();
  const userId = useMemo(() => session?.user?.id, [session?.user?.id]);
  const setCartItems = useSetAtom(cartItemsAtom);
  const { cartItems } = useCart();
  const [opened, { open, close }] = useDisclosure(false);
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
      <ActionIcon
        aria-label="Danh sách yêu thích"
        variant="transparent"
        pos="relative"
        w={40}
        h={40}
        onClick={open}
      >
        
        <ShoppingBag size={20} color="var(--mantine-color-text)" />
        {cartItems.length > 0 && (
          <Badge pos="absolute" top={0} right={0} circle>
            {cartItems.length}
          </Badge>
        )}
      </ActionIcon>

      <Drawer
        opened={opened}
        onClose={close}
        position="right"
        title="Giỏ hàng"
        withCloseButton
        size="lg"
        styles={{
          body: {
            height: "calc(100% - 60px)",
          },
        }}
      >
        <Stack h="100%" justify="space-between">
          <CartItemListing />
          <Button
            component={Link}
            href="/checkout"
            variant="filled"
            size="sm"
            fullWidth
            disabled={cartItems.length === 0}
            onClick={close}
          >
            Thanh toán ngay (
            {formatNumberWithSeperator(
              cartItems.reduce(
                (acc, cur) => acc + (cur.productPrice ?? 0) * cur.quantity,
                0
              )
            )}{" "}
            ₫)
          </Button>
        </Stack>
      </Drawer>
    </>
  );
};
