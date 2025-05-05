"use client";

import { PostListItemResponse } from "@/types/post";
import { Button, Group, Stack, Title } from "@mantine/core";
import Link from "next/link";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import BlogPostItem from "./BlogPostItem";

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
  posts: PostListItemResponse[];
};

export function LatestBlog({ posts }: LatestBlogProps) {
  return (
    <Stack>
      <Group justify="space-between">
        <Title order={3}>Tin công nghệ mới nhất</Title>
        <Button
          component={Link}
          href="/blogs"
          variant="transparent"
          color="dark"
        >
          Xem thêm
        </Button>
      </Group>

      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        pagination={{ clickable: true }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        breakpoints={swiperBreakpoints}
        loop={true}
        style={{ padding: "10px 0 40px 0", margin: 0 }}
      >
        {posts.map((post) => (
          <SwiperSlide key={post.id}>
            <BlogPostItem
              slug={post.slug}
              title={post.title}
              imageUrl={post.thumbnailUrl}
              createdDate={post.createdDate}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </Stack>
  );
}
