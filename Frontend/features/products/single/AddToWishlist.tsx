"use client";

import { useWishlist } from "@/hooks/useWishlist";
import { Button } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { Heart } from "lucide-react";

type AddToWishlistProps = {
  productId: string;
};

export const AddToWishlist = ({ productId }: AddToWishlistProps) => {
  const { addToWishlist } = useWishlist();
  const handleAddToWishlist = () => {
    addToWishlist(productId);
    notifications.show({
      message: "Thêm vào danh sách yêu thích thành công",
      color: "green",
    });
  };
  return (
    <Button
      variant="filled"
      color="pink"
      size="sm"
      leftSection={<Heart />}
      onClick={handleAddToWishlist}
    >
      Thêm vào yêu thích
    </Button>
  );
};
