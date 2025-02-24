import "server-only";

import ImageGallery from "@/components/base/single-product/ImageGallery";
import ProductInfo from "@/components/base/single-product/ProductInfo";
import ProductTabSection from "@/components/base/single-product/ProductTabSection";
import { API_URL } from "@/constant/apiUrl";
import { getByIdApi } from "@/lib/apiClient";
import { parseUUID } from "@/lib/utils";
import { ProductDetailResponse } from "@/types/product";
import { Container, Grid2 as Grid, Paper } from "@mui/material";
import { Metadata } from "next";
import ProductNotFound from "./ProductNotFound";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const parsedId = parseUUID(params.id);
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

export default async function ProductDetail({
  params,
}: {
  params: { id: string };
}) {
  let product: ProductDetailResponse | null = null;
  const parsedId = parseUUID(params.id);
  const response = await getByIdApi(API_URL.product, { id: parsedId });
  if (response.success) {
    product = response.data as ProductDetailResponse;
  }
  return (
    <Container maxWidth="xl">
      {product ? (
        <>
          <Paper elevation={1} sx={{ p: 3 }}>
            <Grid container spacing={4}>
              <Grid size={{ xs: 12, md: 5 }}>
                <ImageGallery images={product.imageUrls} />
              </Grid>
              <Grid size={{ xs: 12, md: 7 }}>
                <ProductInfo product={product} />
              </Grid>
            </Grid>
          </Paper>
          <ProductTabSection
            id={product.id}
            description={product.description}
          />
          {/* <RelatedProducts
            category={product.category}
            currentProductId={product.id}
          /> */}
        </>
      ) : (
        <ProductNotFound />
      )}
    </Container>
  );
}
