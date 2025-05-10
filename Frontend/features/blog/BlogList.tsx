"use client";

import { NoItem } from "@/components/core/NoItem";
import { PostListItemResponse } from "@/types/post";
import { Pagination, SimpleGrid } from "@mantine/core";
import { Newspaper } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import BlogPostItem from "../home/BlogPostItem";

type BlogListProps = {
  posts: PostListItemResponse[];
  currentPage: number;
  totalPages: number;
};

export default function BlogList({
  posts,
  currentPage,
  totalPages,
}: BlogListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = useCallback(
    (value: number) => {
      const params = new URLSearchParams(searchParams);
      params.set("page", value.toString());
      router.push(`?${params.toString()}`);
    },
    [router, searchParams]
  );

  if (posts.length === 0) {
    return (
      <NoItem
        title="Không có bài viết nào"
        description="Hiện tại chưa có bài viết nào được đăng. Vui lòng quay lại sau."
        icon={Newspaper}
      />
    );
  }

  return (
    <>
      <SimpleGrid
        cols={{
          xs: 1,
          sm: 2,
        }}
      >
        {posts.map((post) => (
          <BlogPostItem
            key={post.id}
            slug={post.slug}
            title={post.title}
            imageUrl={post.thumbnailUrl}
            createdDate={post.createdDate}
            imgHeight={315}
          />
        ))}
      </SimpleGrid>

      {totalPages > 1 && (
        <Pagination
          total={totalPages}
          defaultValue={currentPage}
          onChange={handlePageChange}
        />
      )}
    </>
  );
}
