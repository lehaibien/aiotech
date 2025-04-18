import 'server-only';

import { HtmlContent } from '@/components/core/HtmlContent';
import { API_URL } from '@/constant/apiUrl';
import ImageGallery from '@/features/products/single/ImageGallery';
import ProductInfo from '@/features/products/single/ProductInfo';
import { ProductNotFound } from '@/features/products/single/ProductNotFound';
import RelatedProducts from '@/features/products/single/RelatedProductSection';
import ReviewSection from '@/features/products/single/ReviewSection';
import { getByIdApi } from '@/lib/apiClient';
import { parseUUID } from '@/lib/utils';
import { ProductDetailResponse } from '@/types/product';
import {
  Box,
  Breadcrumbs,
  Container,
  Divider,
  Grid2 as Grid,
  Paper,
  Typography,
} from '@mui/material';
import { Metadata } from 'next';
import Link from 'next/link';

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
          alt: product.name + ' image' + (index + 1),
        })),
      },
    };
  }
  return {};
}

export default async function ProductDetail({ params }: { params: Params }) {
  const { id } = await params;
  const parsedId = parseUUID(id);
  let product: ProductDetailResponse | null = null;
  const response = await getByIdApi(API_URL.product, { id: parsedId });
  if (response.success) {
    product = response.data as ProductDetailResponse;
  }
  if (!product) {
    return (
      <Container maxWidth='xl'>
        <ProductNotFound />
      </Container>
    );
  }
  return (
    <>
      {/* Navigation and Breadcrumbs */}
      <Breadcrumbs
        aria-label='breadcrumb'
        sx={{ mb: 2 }}>
        <Link
          href='/'
          style={{
            color: 'inherit',
            textDecoration: 'none',
          }}>
          Trang chủ
        </Link>
        <Link
          href='/products'
          style={{
            color: 'inherit',
            textDecoration: 'none',
          }}>
          Sản phẩm
        </Link>
        <Typography>{product.name}</Typography>
      </Breadcrumbs>

      <Paper sx={{ p: 2 }}>
        <Grid
          container
          spacing={3}>
          <Grid size={{ xs: 12, md: 5 }}>
            <Box
              sx={{
                borderRadius: 1,
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              }}>
              <ImageGallery images={product.imageUrls} />
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 7 }}>
            <ProductInfo product={product} />
          </Grid>
        </Grid>

        {/* Product Description */}
        <Box sx={{ mt: 2 }}>
          <Typography
            variant='h5'
            gutterBottom
            sx={{ fontWeight: 'bold' }}>
            Mô tả sản phẩm
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <HtmlContent content={product.description} />
        </Box>
        <ReviewSection productId={product.id} />
      </Paper>

      <RelatedProducts productId={product.id} />
    </>
  );
}
