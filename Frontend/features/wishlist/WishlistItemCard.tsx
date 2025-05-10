import { IMAGE_ASPECT_RATIO } from "@/constant/imageAspectRatio";
import useCart from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { formatNumberWithSeperator } from "@/lib/utils";
import { UUID } from "@/types";
import { Button, Card, Center, Group, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { Heart, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { MouseEvent } from "react";

type WishlistItemCardProps = {
  productId: UUID;
  productName: string;
  productImageUrl: string;
  productPrice: number;
};

export const WishlistItemCard = ({
  productId,
  productName,
  productImageUrl,
  productPrice,
}: WishlistItemCardProps) => {
  const { addToCart } = useCart();
  const { removeFromWishlist } = useWishlist();
  const handleAddToCart = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      productId,
      productName,
      productImage: productImageUrl,
      productPrice,
      quantity: 1,
    });
    notifications.show({
      message: "Thêm vào giỏ hàng thành công",
      color: "green",
    });
  };

  const handleRemoveFromWishlist = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    removeFromWishlist(productId);
    notifications.show({
      message: "Hủy yêu thích thành công",
      color: "green",
    });
  };
  return (
    <Card component={Link} href={`/products/${productId}`}>
      <Card.Section>
        <Center>
          <Image
            src={productImageUrl}
            height={200}
            width={200}
            alt={productName}
            style={{
              objectFit: "fill",
              aspectRatio: IMAGE_ASPECT_RATIO.PRODUCT,
            }}
            priority={true}
          />
        </Center>
      </Card.Section>
      <Text lineClamp={2}>{productName}</Text>
      <Text c="red" fw={600}>
        {formatNumberWithSeperator(productPrice)} đ
      </Text>
      <Group gap={4} wrap="nowrap">
        <Button
          fullWidth
          variant="filled"
          size="sm"
          leftSection={<ShoppingCart />}
          onClick={handleAddToCart}
          data-umami-event="Thêm vào giỏ hàng"
        >
          Thêm vào giỏ
        </Button>
        <Button
          variant="filled"
          color="red"
          size="sm"
          onClick={handleRemoveFromWishlist}
          data-umami-event="Huỷ yêu thích sản phẩm"
        >
          <Heart />
        </Button>
      </Group>
    </Card>
  );
};
