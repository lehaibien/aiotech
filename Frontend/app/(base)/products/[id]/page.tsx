import { HtmlContent } from "@/components/core/HtmlContent";
import { API_URL } from "@/constant/apiUrl";
import { ImageGallery } from "@/features/products/single/ImageGallery";
import { ProductInfo } from "@/features/products/single/ProductInfo";
import { ProductNotFound } from "@/features/products/single/ProductNotFound";
import RelatedProducts from "@/features/products/single/RelatedProductSection";
import ReviewSection from "@/features/products/single/ReviewSection";
import { getByIdApi } from "@/lib/apiClient";
import { parseUUID } from "@/lib/utils";
import { ProductDetailResponse } from "@/types/product";
import { Divider, Grid, GridCol, Stack, Title } from "@mantine/core";
import { Metadata } from "next";

type Params = Promise<{
  id: string;
}>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { id } = await params;
  const parsedId = parseUUID(id);
  const response = await getByIdApi(API_URL.product, { id: parsedId });
  if (response.success) {
    const product = response.data as ProductDetailResponse;
    return {
      title: product.name,
      description: product.description,
      keywords: [product.brand, product.category, ...product.tags],
      openGraph: {
        title: product.name,
        description: product.description,
        images: product.imageUrls.map((url, index) => ({
          url: url,
          width: 500,
          height: 500,
          alt: product.name + " image" + (index + 1),
        })),
      },
    };
  }
  return {};
}

export default async function Page({ params }: { params: Params }) {
  const { id } = await params;
  const parsedId = parseUUID(id);
  let product: ProductDetailResponse | null = null;
  const response = await getByIdApi(API_URL.product, { id: parsedId });
  if (response.success) {
    product = response.data as ProductDetailResponse;
  }
  if (!product) {
    return <ProductNotFound />;
  }
  return (
    <Stack p={4}>
      <Grid>
        <GridCol
          span={{
            xs: 12,
            md: 5,
          }}
        >
          <ImageGallery images={product.imageUrls} />
        </GridCol>
        <GridCol
          span={{
            xs: 12,
            md: 7,
          }}
        >
          <ProductInfo product={product} />
        </GridCol>
      </Grid>

      <Stack gap={2}>
        <Title order={5}>Mô tả sản phẩm</Title>
        <Divider />
        <HtmlContent content={product.description} />
      </Stack>
      <Divider />
      <ReviewSection productId={product.id} />
      <RelatedProducts productId={product.id} />
    </Stack>
  );
}
