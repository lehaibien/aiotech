import { API_URL } from "@/constant/apiUrl";
import { Banner } from "@/features/home/Banner";
import { BestSeller } from "@/features/home/BestSeller";
import { FeaturedCategories } from "@/features/home/FeaturedCategories";
import { LatestBlog } from "@/features/home/LatestBlog";
import { NewArrival } from "@/features/home/NewArrival";
import { getApi, getListApi } from "@/lib/apiClient";
import {
  CategoryResponse,
  BaseGetListRequest,
  PaginatedList,
  PostPreviewResponse,
  ProductResponse,
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
  const categoryRequest: BaseGetListRequest = {
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
  const postRequest: BaseGetListRequest = {
    pageIndex: 0,
    pageSize: 10,
    textSearch: "",
  };
  const postResponse = await getListApi(API_URL.postPreview, postRequest);
  if (postResponse.success) {
    const data = postResponse.data as PaginatedList<PostPreviewResponse>;
    posts = data.items;
  } else {
    console.error("Failed to load featured categories: ", postResponse.message);
  }
  return (
    <Container
      maxWidth="xl"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1,
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
