'use client'

import { Button } from "@mui/material"
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import useCart from "@/hooks/useCart";
import { UUID } from "@/types";

type AddToCartButtonProps = {
    productId: UUID;
    productName: string;
    productPrice: number;
    productImage: string;
}

export function AddToCartButton({
    productId,
    productName,
    productPrice,
    productImage,
}: AddToCartButtonProps) {
    const { addToCart } = useCart();
    return (
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddShoppingCartIcon />}
          data-umami-event="Thêm vào giỏ hàng"
          size="medium"
          onClick={() =>
            addToCart({
              productId: productId,
              productName: productName,
              productPrice: productPrice,
              productImage: productImage,
              quantity: 1,
            })
          }
        >
          Thêm vào giỏ hàng
        </Button>
    )
}