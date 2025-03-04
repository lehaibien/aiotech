"use client";

import { HighlightTypography } from "@/components/core/HighlightTypography";
import { PostPreviewResponse } from "@/types/post";
import { Box, Button, Theme, useMediaQuery } from "@mui/material";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import BlogPostItem from "./BlogPostItem";
import Link from "next/link";

const swiperBreakpoints = {
  320: {
    slidesPerView: 1,
    spaceBetween: 20,
  },
  640: {
    slidesPerView: 2,
    spaceBetween: 30,
  },
  1024: {
    slidesPerView: 3,
    spaceBetween: 40,
  },
};

type LatestBlogProps = {
  posts: PostPreviewResponse[];
};

export function LatestBlog({ posts }: LatestBlogProps) {
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mb: 4,
        gap: 2,
        "& .swiper-button-next, .swiper-button-prev": {
          color: "primary.main",
          "&::after": {
            fontSize: "16px",
          },
          width: "24px",
          height: "24px",
          padding: 2,
          backgroundColor: "rgba(0, 0, 0, 0.15)",
          borderRadius: "50%",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <HighlightTypography
          variant="h5"
          component="h2"
          gutterBottom
          sx={{
            fontWeight: 600,
          }}
        >
          Tin công nghệ mới nhất
        </HighlightTypography>
        <Button component={Link} href="/blogs" variant="text" color="primary">
          Xem thêm
        </Button>
      </Box>

      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation={!isMobile}
        pagination={{ clickable: true }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        breakpoints={swiperBreakpoints}
        loop={true}
        style={{ padding: "10px 0 40px 0" }}
      >
        {posts.map((post) => (
          <SwiperSlide key={post.id}>
            <BlogPostItem
              id={post.id}
              title={post.title}
              imageUrl={post.imageUrl}
              createdDate={post.createdDate}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
}
