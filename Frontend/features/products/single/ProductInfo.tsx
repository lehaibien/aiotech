import { formatNumberWithSeperator } from "@/lib/utils";
import { ProductDetailResponse } from "@/types/product";
import { Badge, Group, Rating, Stack, Text, Title } from "@mantine/core";
import { AddToCartButton } from "./AddToCartButton";
import { AddToWishlist } from "./AddToWishlist";

type ProductInfoProps = {
  product: ProductDetailResponse;
};

export const ProductInfo = ({ product }: ProductInfoProps) => {
  return (
    <Stack gap={4}>
      <Title order={1}>{product.name}</Title>
      <Group>
        <Text>Mã hàng: {product.sku}</Text>
        <Text>Thương hiệu: {product.brand}</Text>
      </Group>
      <Group>
        <Rating defaultValue={product.rating} readOnly size="md" />
        <Text>({product.rating.toFixed(1)})</Text>
      </Group>
      {product.discountPrice ? (
        <Group gap={4} align="center">
          <Text c="red" size="xl">
            {formatNumberWithSeperator(product.discountPrice)} VNĐ
          </Text>
          <Text td="line-through">
            {formatNumberWithSeperator(product.price)} VNĐ
          </Text>
          <Badge color="red" size="md" variant="outline">
            -
            {(
              ((product.price - product.discountPrice) / product.price) *
              100
            ).toFixed(2)}
            %
          </Badge>
        </Group>
      ) : (
        <Text c="red" size="lg">
          {formatNumberWithSeperator(product.price)} VNĐ
        </Text>
      )}
      <Group gap={8}>
        <AddToCartButton
          productId={product.id}
          productName={product.name}
          productPrice={product.discountPrice ?? product.price}
          productImage={product.imageUrls[0]}
        />
        <AddToWishlist productId={product.id} />
        <Text>{product.stock} trong kho</Text>
      </Group>
    </Stack>
  );
};
