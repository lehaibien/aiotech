import { API_URL } from "@/constant/apiUrl";
import { Banner } from "@/features/home/Banner";
import { BestSeller } from "@/features/home/BestSeller";
import { FeaturedCategories } from "@/features/home/FeaturedCategories";
import { LatestBlog } from "@/features/home/LatestBlog";
import { NewArrival } from "@/features/home/NewArrival";
import { getApi, getListApi } from "@/lib/apiClient";
import {
  CategoryResponse,
  PaginatedList,
  PostPreviewResponse,
  ProductResponse
} from "@/types";
import { BannerConfiguration } from "@/types/config";
import { Container } from "@mui/material";
import { Metadata } from "next";

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
  const bannerPromise = getApi(API_URL.bannerConfig);
  const newProductsPromise = getApi(API_URL.productTop + "/8");
  const featuredProductsPromise = getApi(API_URL.productFeatured + "/8");
  const featuredCategoriesPromise = getListApi(API_URL.category, {
    pageIndex: 0,
    pageSize: 16,
    textSearch: "",
  });
  const postsPromise = getListApi(API_URL.postPreview, {
    pageIndex: 0,
    pageSize: 10,
    textSearch: "",
  });

  const [
    bannerResponse,
    newProductsResponse,
    featuredProductsResponse,
    featuredCategoriesResponse,
    postsResponse,
  ] = await Promise.all([
    bannerPromise,
    newProductsPromise,
    featuredProductsPromise,
    featuredCategoriesPromise,
    postsPromise,
  ]);

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

  if (newProductsResponse.success) {
    newProducts = newProductsResponse.data as ProductResponse[];
  } else {
    console.error("Failed to load new products: ", newProductsResponse.message);
  }

  if (featuredProductsResponse.success) {
    newProducts = featuredProductsResponse.data as ProductResponse[];
  } else {
    console.error(
      "Failed to load featured products: ",
      featuredProductsResponse.message
    );
  }

  if (featuredCategoriesResponse.success) {
    featuredCategories = (
      featuredCategoriesResponse.data as PaginatedList<CategoryResponse>
    ).items;
  } else {
    console.error(
      "Failed to load featured categories: ",
      featuredCategoriesResponse.message
    );
  }

  if (postsResponse.success) {
    posts = (postsResponse.data as PaginatedList<PostPreviewResponse>).items;
  } else {
    console.error("Failed to load posts: ", postsResponse.message);
  }
  return (
    <Container
      maxWidth="xl"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      {/* Hero Banner */}
      <Banner
        title={bannerConfig.title}
        description={bannerConfig.description}
        imageUrl={bannerConfig.imageUrl}
      />

      <FeaturedCategories categories={featuredCategories} />

      <BestSeller products={newProducts} />

      <NewArrival products={newProducts} />

      <LatestBlog posts={posts} />
    </Container>
  );
}
