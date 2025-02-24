import LatestBlog from "@/components/base/home/LatestBlog";
import ProductCard from "@/components/base/products/ProductCard";
import { API_URL } from "@/constant/apiUrl";
import { getApi, getListApi } from "@/lib/apiClient";
import {
  CategoryResponse,
  GetListRequest,
  PaginatedList,
  PostPreviewResponse,
  ProductResponse,
} from "@/types";
import { BannerConfiguration } from "@/types/config";
import { ArrowForward } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: {
    absolute: "AioTech - Công Nghệ & Thiết Bị Điện Tử",
  },
};

export default async function Home() {
  let bannerConfig: BannerConfiguration = {
    title: "",
    description: "",
    imageUrl: "",
  };

  let newProducts: ProductResponse[] = [];
  let featuredCategories: CategoryResponse[] = [];
  let posts: PostPreviewResponse[] = [];
  const bannerResponse = await getApi(API_URL.bannerConfig);
  if (bannerResponse.success) {
    bannerConfig = bannerResponse.data as BannerConfiguration;
  } else {
    bannerConfig = {
      title: "AioTech",
      description: "",
      imageUrl: "/hero-banner.jpg",
    };
    console.error("Failed to load banner config: ", bannerResponse.message);
  }
  const top = 8;
  const newProductsResponse = await getApi(API_URL.productTop + `/${top}`);
  if (newProductsResponse.success) {
    newProducts = newProductsResponse.data as ProductResponse[];
  } else {
    console.error("Failed to load new products: ", newProductsResponse.message);
  }
  const categoryRequest: GetListRequest = {
    pageIndex: 0,
    pageSize: 16,
    textSearch: "",
  };
  const categoryResponse = await getListApi(API_URL.category, categoryRequest);
  if (categoryResponse.success) {
    const data = categoryResponse.data as PaginatedList<CategoryResponse>;
    featuredCategories = data.items;
  } else {
    console.error(
      "Failed to load featured categories: ",
      categoryResponse.message
    );
  }
  const postRequest: GetListRequest = {
    pageIndex: 0,
    pageSize: 10,
    textSearch: "",
  };
  const postResponse = await getListApi(API_URL.postPreview, postRequest);
  if (postResponse.success) {
    posts = postResponse.data as PostPreviewResponse[];
  } else {
    console.error("Failed to load featured categories: ", postResponse.message);
  }
  return (
    <Container maxWidth="xl">
      {/* Hero Banner */}
      <Box
        sx={{
          position: "relative",
          height: "500px", // Fixed height for the banner
          borderRadius: 2,
          overflow: "hidden",
          mb: 4,
        }}
      >
        {/* Next.js Image component */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 1, // Ensure the image is behind the text
          }}
        >
          <Image
            src={bannerConfig.imageUrl || "/hero-banner.jpg"}
            alt="Banner Image"
            layout="fill"
            objectFit="cover"
            quality={100}
            priority // Optional: if this image is above the fold
          />
        </Box>

        {/* Text and Button Overlay */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end", // Align text to the bottom
            alignItems: "flex-start", // Align text to the left
            p: 4,
            backgroundColor: "rgba(0,0,0,0.5)",
            color: "white",
            zIndex: 2, // Ensure the text is above the image
          }}
        >
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              fontSize: "clamp(2rem, 10vw, 2.15rem)",
              mb: 2,
            }}
          >
            {bannerConfig.title || "AioTech"}
          </Typography>
          <Typography
            variant="h5"
            gutterBottom
            sx={{ lineHeight: 1.5, fontSize: "clamp(1.2rem, 10rem, 1.2rem)" }}
          >
            {bannerConfig.description}
          </Typography>
          <Button
            LinkComponent={Link}
            href="/products"
            variant="contained"
            color="primary"
            size="large"
            endIcon={<ArrowForward />}
          >
            Mua ngay
          </Button>
        </Box>
      </Box>

      {/* Category*/}
      <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 4 }}>
        Khám phá danh mục
      </Typography>
      <Grid container spacing={3} sx={{ mb: 8 }}>
        {featuredCategories.map((category) => (
          <Grid item xs={6} sm={4} md={3} lg={12 / 8} key={category.id}>
            <Card
              sx={{
                position: "relative",
                overflow: "hidden",
                height: 180,
              }}
            >
              <CardActionArea
                LinkComponent={Link}
                href={`products/?category=${category.name}`}
              >
                <CardMedia>
                  <Image
                    src={category.imageUrl}
                    width={600}
                    height={600}
                    alt={category.name}
                    style={{
                      maxHeight: 100,
                      objectFit: "cover",
                      aspectRatio: 1 / 1,
                    }}
                  />
                </CardMedia>
                <CardContent
                  sx={{
                    textAlign: "center",
                  }}
                >
                  {category.name}
                </CardContent>
              </CardActionArea>
              {/* <Box
                className='category-overlay'
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  opacity: 0.9,
                  transition: 'opacity 0.3s',
                  bgcolor: 'rgba(0,0,0,0.4)',
                }}
              >
                <Typography variant='h5' sx={{ mb: 2 }}>
                  {category.name}
                </Typography>
                <Button
                  LinkComponent={Link}
                  href={`products/?category=${category.name}`}
                  variant='outlined'
                  color='inherit'
                  endIcon={<ArrowForward />}
                >
                  Xem ngay
                </Button>
              </Box> */}
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* New Arrivals */}
      <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 4 }}>
        Sản phẩm bán chạy
      </Typography>
      <Grid container spacing={4} sx={{ mb: 8 }}>
        {newProducts.map((product) => (
          <Grid item xs={12} sm={6} md={3} key={product.id}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>

      {/* New Arrivals */}
      <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 4 }}>
        Sản phẩm mới
      </Typography>
      <Grid container spacing={4} sx={{ mb: 8 }}>
        {newProducts.map((product) => (
          <Grid item xs={12} sm={6} md={3} key={product.id}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>

      {/* Latest Blog */}
      <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 4 }}>
        Tin công nghệ mới nhất
      </Typography>
      <LatestBlog posts={posts} />
    </Container>
  );
}
