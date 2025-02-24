"use client";

import { PostPreviewResponse } from "@/types/post";
import { useMediaQuery, useTheme } from "@mui/material";
import Carousel, { ResponsiveType } from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import BlogPostItem from "./BlogPostItem";

const responsive: ResponsiveType = {
  desktop: {
    breakpoint: {
      max: 3000,
      min: 1024,
    },
    items: 3,
    partialVisibilityGutter: 40,
    slidesToSlide: 3,
  },
  mobile: {
    breakpoint: {
      max: 464,
      min: 0,
    },
    items: 1,
    partialVisibilityGutter: 80,
    slidesToSlide: 1,
  },
  tablet: {
    breakpoint: {
      max: 1024,
      min: 464,
    },
    items: 2,
    partialVisibilityGutter: 60,
    slidesToSlide: 2,
  },
};

type LatestBlogProps = {
  posts: PostPreviewResponse[];
};

function LatestBlog({ posts }: LatestBlogProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Carousel
      additionalTransfrom={0}
      arrows={true}
      removeArrowOnDeviceType={[/*"tablet", */ "mobile"]}
      partialVisible
      autoPlay={isMobile ? true : false}
      autoPlaySpeed={3000}
      centerMode={false}
      sliderClass="gap-4"
      draggable={isMobile}
      focusOnSelect={false}
      keyBoardControl
      minimumTouchDrag={80}
      pauseOnHover
      renderArrowsWhenDisabled={false}
      renderButtonGroupOutside={false}
      renderDotsOutside={false}
      responsive={responsive}
      rewind={false}
      rewindWithAnimation={false}
      rtl={false}
      shouldResetAutoplay
      showDots={false}
      swipeable={isMobile}
      ssr
    >
      {posts.map((post) => (
        <BlogPostItem
          key={post.id}
          id={post.id}
          title={post.title}
          imageUrl={post.imageUrl}
          createdDate={post.createdDate}
        />
      ))}
    </Carousel>
  );
}

export default LatestBlog;
