import { API_URL } from "@/constant/apiUrl";
import { postApi, putApi } from "@/lib/apiClient";
import { cartItemsAtom } from "@/lib/globalState";
import { parseUUID } from "@/lib/utils";
import {
  CartItemRequest,
  CartItemResponse,
  RemoveCartItemRequest,
} from "@/types";
import { useAtom } from "jotai";
import { useSession } from "next-auth/react";
import { useCallback, useMemo } from "react";

export default function useCart() {
  const [cartItems, setCartItems] = useAtom(cartItemsAtom);
  const { data: session } = useSession();

  const userId = useMemo(() => session?.user?.id, [session?.user?.id]);

  const addToCart = useCallback(
    (cartItem: CartItemResponse) => {
      if (userId) {
        const request: CartItemRequest = {
          userId: parseUUID(userId),
          productId: cartItem.productId,
          quantity: cartItem.quantity,
        };
        postApi(API_URL.cart, request).then((res) => {
          if (res.success) setCartItems(res.data as CartItemResponse[]);
        });
      } else {
        setCartItems((prevCartItems) => {
          const existingItem = prevCartItems.find(
            (item) => item.productId === cartItem.productId
          );
          const newItems = existingItem
            ? prevCartItems.map((item) =>
                item.productId === cartItem.productId
                  ? { ...item, quantity: cartItem.quantity }
                  : item
              )
            : [...prevCartItems, { ...cartItem, quantity: 1 }];

          localStorage.setItem("cart", JSON.stringify(newItems));
          return newItems;
        });
      }
    },
    [userId, setCartItems]
  );

  const removeFromCart = useCallback(
    (productId: string) => {
      if (userId) {
        const request: RemoveCartItemRequest = {
          userId: parseUUID(userId),
          productId: parseUUID(productId),
        };
        putApi(API_URL.cart, request).then((res) => {
          if (res.success) {
            setCartItems((prev) =>
              prev.filter((item) => item.productId !== productId)
            );
          }
        });
      } else {
        setCartItems((prev) => {
          const newItems = prev.filter((item) => item.productId !== productId);
          localStorage.setItem("cart", JSON.stringify(newItems));
          return newItems;
        });
      }
    },
    [userId, setCartItems]
  );

  return { cartItems, addToCart, removeFromCart };
}
