import Image from "next/image";
import { formatNumberWithSeperator } from "@/lib/utils";
import Link from "next/link";
import { Group, Stack, Text, Paper, Divider } from "@mantine/core";
import { IMAGE_ASPECT_RATIO } from "@/constant/image";

type ProductSearch = {
  id: string;
  name: string;
  image: string;
  price: number;
  brand: string;
};

type ProductSearchListProps = {
  products: ProductSearch[];
  isDrawer?: boolean;
  onClick?: () => void;
};

export const ProductSearchList = ({
  products,
  isDrawer = false,
  onClick,
}: ProductSearchListProps) => {
  if (products.length === 0) {
    return null;
  }
  const listContent = (
    <Stack gap={0}>
      {products.map((product, index) => (
        <Link
          key={product.id}
          href={`/products/${product.id}`}
          onClick={onClick}
        >
          <Group
            p="xs"
            style={{
              '&:hover': {
                backgroundColor: 'var(--mantine-color-gray-0)',
              },
            }}
          >
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              width={50}
              height={50}
              style={{ 
                objectFit: "fill", 
                aspectRatio: IMAGE_ASPECT_RATIO.PRODUCT 
              }}
            />
            <Stack gap={2}>
              <Text lineClamp={1}>{product.name}</Text>
              <Text size="sm" c="dimmed">
                {product.brand}
              </Text>
              <Text c="red">
                {formatNumberWithSeperator(product.price)} đ
              </Text>
            </Stack>
          </Group>
          {index < products.length - 1 && <Divider />}
        </Link>
      ))}
    </Stack>
  );

  if (isDrawer) {
    return listContent;
  }

  return (
    <Paper
      shadow="sm"
      style={{
        position: "absolute",
        top: "100%",
        left: 0,
        right: 0,
        zIndex: 4000,
        maxHeight: "400px",
        width: "100%",
        overflowY: "auto",
      }}
      withBorder
    >
      {products.map((product) => (
        <BaseProductSearchItem
          key={product.id}
          product={product}
          onClick={onClick}
        />
      ))}
    </Paper>
  );
};

const BaseProductSearchItem = ({
  product,
  onClick,
}: {
  product: ProductSearch;
  onClick?: () => void;
}) => {
  return (
    <Link key={product.id} href={`/products/${product.id}`} onClick={onClick}>
      <Group gap={8} p={4}>
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          width={50}
          height={50}
          style={{ objectFit: "fill", aspectRatio: IMAGE_ASPECT_RATIO.PRODUCT }}
        />
        <Stack gap={0}>
          <Text c="dark">{product.name}</Text>
          <Text c="dark" size="sm">
            {product.brand}
          </Text>
          <Text c="red">{formatNumberWithSeperator(product.price)} đ</Text>
        </Stack>
      </Group>
    </Link>
  );
};
