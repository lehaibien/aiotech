"use client";

import { HtmlContent } from "@/components/core/HtmlContent";
import { IMAGE_ASPECT_RATIO } from "@/constant/image";
import { ProductDetailResponse } from "@/types";
import {
  Button,
  Divider,
  Grid,
  Group,
  Pill,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { CheckCircle, CircleAlert } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ProductImageView } from "./ProductImageView";

type ProductViewProps = {
  product: ProductDetailResponse;
};

export default function ProductView({ product }: ProductViewProps) {
  return (
    <Stack>
      <Group>
        <Title order={3}>{product.name}</Title>
        <Pill c={product.isFeatured ? "blue" : "dimmed"}>
          {product.isFeatured ? "Sản phẩm nổi bật" : "Sản phẩm thường"}
        </Pill>
      </Group>

      <Grid>
        <Grid.Col span={{ base: 12, md: 9 }}>
          <Title order={6}>Thông tin chung</Title>

          <Stack>
            <Group justify="space-between">
              <Text>SKU:</Text>
              <Text>{product.sku}</Text>
            </Group>

            <Divider />

            <Group justify="space-between">
              <Text>Giá niêm yết:</Text>
              <Text>{product.price.toLocaleString()} đ</Text>
            </Group>

            <Divider />

            <Group justify="space-between">
              <Text>Giá khuyến mãi:</Text>
              <Text c={product.discountPrice ? "green" : "default"}>
                {product.discountPrice
                  ? `${product.discountPrice.toLocaleString()} đ`
                  : "-"}
              </Text>
            </Group>

            <Divider />

            <Group justify="space-between">
              <Text>Tồn kho:</Text>
              <Group gap="xs">
                {product.stock > 0 ? (
                  <>
                    <CheckCircle color="green" size={16} />
                    <Text>{product.stock}</Text>
                  </>
                ) : (
                  <>
                    <CircleAlert color="red" size={16} />
                    <Text c="red">Hết hàng</Text>
                  </>
                )}
              </Group>
            </Group>

            <Divider />

            <Group justify="space-between">
              <Text>Thương hiệu:</Text>
              <Text>{product.brand}</Text>
            </Group>

            <Divider />

            <Group justify="space-between">
              <Text>Danh mục:</Text>
              <Text>{product.category}</Text>
            </Group>

            <Divider />

            <Group justify="space-between">
              <Text>Thẻ:</Text>
              <Text>{product.tags.join(", ")}</Text>
            </Group>

            <Divider />

            <Stack gap='xs'>
              <Text>Mô tả:</Text>
              <HtmlContent content={product.description} />
            </Stack>
          </Stack>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 3 }}>
          <Stack>
            <Title order={6}>Ảnh đại diện</Title>
            <Image
              src={product.imageUrls[0]}
              alt={product.name}
              width={300}
              height={300}
              style={{
                objectFit: "fill",
                height: "100%",
                width: "100%",
                aspectRatio: IMAGE_ASPECT_RATIO.PRODUCT,
                backgroundColor: "white",
                padding: "var(--mantine-spacing-xs)",
              }}
            />
            <Title order={6}>Hình ảnh chi tiết</Title>
            <ProductImageView imageUrls={product.imageUrls} />
          </Stack>
        </Grid.Col>
      </Grid>

      <Group justify="flex-end">
        <Button
          variant="outline"
          component={Link}
          href="/dashboard/products"
        >
          Quay lại
        </Button>
        <Button
          component={Link}
          href={`/dashboard/products/upsert?id=${product.id}`}
        >
          Chỉnh sửa
        </Button>
      </Group>
    </Stack>
  );
}
