import { API_URL } from "@/constant/apiUrl";
import { HeroBanner } from "@/features/home/Banner";
import { BestSeller } from "@/features/home/BestSeller";
import { FeaturedCategories } from "@/features/home/FeaturedCategories";
import { LatestBlog } from "@/features/home/LatestBlog";
import { NewArrival } from "@/features/home/NewArrival";
import { getApi, getApiQuery, getListApi } from "@/lib/apiClient";
import {
  CategoryResponse,
  PaginatedList,
  PostListItemResponse,
  ProductListItemResponse,
} from "@/types";
import { BannerConfiguration } from "@/types/sys-config";
import { Container } from "@mui/material";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute: "AioTech - Công Nghệ & Thiết Bị Điện Tử",
  },
};

export default async function Home() {
  let bannerConfig: BannerConfiguration = {
    title: "AioTech",
    description: "",
    imageUrl: "/hero-banner.jpg",
  };

  let topProducts: ProductListItemResponse[] = [];
  let newestProducts: ProductListItemResponse[] = [];
  let featuredCategories: CategoryResponse[] = [];
  let posts: PostListItemResponse[] = [];
  const bannerPromise = getApi(API_URL.bannerConfig);
  const featuredCategoriesPromise = getListApi(API_URL.category, {
    pageIndex: 0,
    pageSize: 16,
    textSearch: "",
  });
  const topProductsPromise = getApiQuery(API_URL.productTop, {});
  const featuredProductsPromise = getApiQuery(API_URL.productNewest, {});
  const postsPromise = getListApi(API_URL.postPreview, {
    pageIndex: 0,
    pageSize: 10,
    textSearch: "",
  });

  const [
    bannerResponse,
    topProductsResponse,
    featuredProductsResponse,
    featuredCategoriesResponse,
    postsResponse,
  ] = await Promise.all([
    bannerPromise,
    topProductsPromise,
    featuredProductsPromise,
    featuredCategoriesPromise,
    postsPromise,
  ]);

  if (bannerResponse.success) {
    bannerConfig = bannerResponse.data as BannerConfiguration;
  } else {
    console.error("Failed to load banner config: ", bannerResponse.message);
  }

  if (topProductsResponse.success) {
    topProducts = topProductsResponse.data as ProductListItemResponse[];
  } else {
    console.error("Failed to load top products: ", topProductsResponse.message);
  }

  if (featuredProductsResponse.success) {
    newestProducts = featuredProductsResponse.data as ProductListItemResponse[];
  } else {
    console.error(
      "Failed to load new products: ",
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
    posts = (postsResponse.data as PaginatedList<PostListItemResponse>).items;
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
      <HeroBanner
        title={bannerConfig.title}
        description={bannerConfig.description}
        imageUrl={bannerConfig.imageUrl}
      />

      <FeaturedCategories categories={featuredCategories} />

      <BestSeller items={topProducts} />

      <NewArrival items={newestProducts} />

      <LatestBlog posts={posts} />
    </Container>
  );
}
