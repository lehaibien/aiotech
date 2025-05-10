import { API_URL } from "@/constant/apiUrl";
import BlogList from "@/features/blog/BlogList";
import { getListApi } from "@/lib/apiClient";
import { PaginatedList, SearchParams } from "@/types";
import { PostListItemResponse } from "@/types/post";
import { Box, Stack, Text, TextInput, Title } from "@mantine/core";
import { Search } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blogs | AioTech",
  description: "Khám phá các bài viết công nghệ mới nhất từ AioTech",
  keywords: ["blog", "công nghệ", "tech", "tin tức", "AioTech"],
};

async function fetchBlogPosts(
  page: number = 1,
  pageSize: number = 10,
  search: string = ""
): Promise<PaginatedList<PostListItemResponse>> {
  const response = await getListApi(API_URL.postPreview, {
    pageIndex: page - 1,
    pageSize,
    textSearch: search,
  });

  if (!response.success) {
    return {
      items: [],
      totalCount: 0,
      pageSize,
      pageIndex: page - 1,
    };
  }

  return response.data as PaginatedList<PostListItemResponse>;
}

export default async function BlogsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { page, search } = await searchParams;
  const pageSize = 8;
  const pageIndex = page ? parseInt(page) : 1;
  const searchTerm = search ? search : "";

  const { items, totalCount } = await fetchBlogPosts(
    pageIndex,
    pageSize,
    searchTerm
  );
  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <Stack gap="md">
      <div>
        <Title order={1}>Tin tức công nghệ</Title>
        <Text>Khám phá những tin tức công nghệ mới nhất và hữu ích nhất</Text>
      </div>

      {/* Search Box */}
      <Box component="form" method="get" action="/blogs">
        <TextInput
          size="md"
          placeholder="Tìm kiếm bài viết..."
          name="search"
          defaultValue={search}
          leftSection={<Search />}
        />
      </Box>

      <BlogList posts={items} currentPage={pageIndex} totalPages={totalPages} />
    </Stack>
  );
}
