import "server-only";

import { API_URL } from "@/constant/apiUrl";
import ImageGallery from "@/features/single-product/ImageGallery";
import ProductInfo from "@/features/single-product/ProductInfo";
import ReviewSection from "@/features/single-product/ReviewSection";
import { getByIdApi } from "@/lib/apiClient";
import { parseUUID } from "@/lib/utils";
import { ProductDetailResponse } from "@/types/product";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import HomeIcon from "@mui/icons-material/Home";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import {
  Box,
  Breadcrumbs,
  Button,
  Container,
  Divider,
  Grid2 as Grid,
  Paper,
  Typography
} from "@mui/material";
import { Metadata } from "next";
import Link from "next/link";
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
  if (!product) {
    return (
      <Container maxWidth="xl">
        <ProductNotFound />
      </Container>
    );
  }
  return (
    <Container maxWidth="xl">
      {/* Navigation and Breadcrumbs */}
      <Box sx={{ mb: 3 }}>
        <Button
          component={Link}
          href="/products"
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 2 }}
          variant="text"
          color="primary"
        >
          Quay lại cửa hàng
        </Button>
        
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', color: 'inherit', textDecoration: 'none' }}>
            <HomeIcon sx={{ mr: 0.5 }} fontSize="small" />
            Trang chủ
          </Link>
          <Link href="/products" style={{ display: 'flex', alignItems: 'center', color: 'inherit', textDecoration: 'none' }}>
            <ShoppingBagIcon sx={{ mr: 0.5 }} fontSize="small" />
            Sản phẩm
          </Link>
          <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
            {product.name}
          </Typography>
        </Breadcrumbs>
      </Box>

      {/* Product Information */}
      <Paper elevation={2} sx={{ p: { xs: 2, md: 3 }, mb: 4, borderRadius: 2 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 5 }}>
            <Box sx={{ 
              borderRadius: 1, 
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
            }}>
              <ImageGallery images={product.imageUrls} />
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 7 }}>
            <ProductInfo product={product} />
          </Grid>
        </Grid>
      </Paper>

      {/* Product Description */}
      <Paper elevation={2} sx={{ p: { xs: 2, md: 3 }, mb: 4, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
          Mô tả sản phẩm
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ 
          '& img': { maxWidth: '100%', height: 'auto' },
          '& ul, & ol': { pl: 3 },
          '& p': { mb: 1.5 }
        }}>
          <div dangerouslySetInnerHTML={{ __html: product.description }} />
        </Box>
      </Paper>

      {/* Reviews Section */}
      <Paper elevation={2} sx={{ p: { xs: 2, md: 3 }, borderRadius: 2 }}>
        <ReviewSection productId={product.id} />
      </Paper>
      
      {/* Uncomment when ready to implement */}
      {/* <ProductTabSection id={product.id} description={product.description} /> */}
      {/* <RelatedProducts
            category={product.category}
            currentProductId={product.id}
          /> */}
    </Container>
  );
}
