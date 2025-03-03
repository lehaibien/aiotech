"use client";

import { List } from "@mui/material";
import { UUID } from "crypto";
import CartItemComponent from "./CartItemComponent";
import useCart from "@/hooks/useCart";

function CartItemList({}) {
  const { cartItems } = useCart();
  const onRemoveFromCart = (id: UUID) => {
    console.log(id);
  };

  const onQuantityChange = (id: UUID, quantity: number) => {
    console.log(id, quantity);
  };
  return (
    <>
      <h1>Test</h1>
      <List>
        {cartItems.map((cart) => {
          return (
            <CartItemComponent
              key={cart.productId}
              id={cart.productId}
              name={cart.productName}
              image={cart.productImage}
              price={cart.productPrice}
              quantity={cart.quantity}
              onRemoveFromCart={onRemoveFromCart}
              onQuantityChange={onQuantityChange}
            />
          );
        })}
      </List>
    </>
  );
}

export default CartItemList;
