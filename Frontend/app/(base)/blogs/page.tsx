import { HighlightTypography } from "@/components/core/HighlightTypography";
import { API_URL } from "@/constant/apiUrl";
import BlogList from "@/features/blog/BlogList";
import { getListApi } from "@/lib/apiClient";
import { PaginatedList, SearchParams } from "@/types";
import { PostPreviewResponse } from "@/types/post";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
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
): Promise<PaginatedList<PostPreviewResponse>> {
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

  return response.data as PaginatedList<PostPreviewResponse>;
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
    <Stack gap={2}>
      <Box>
        <HighlightTypography variant="h4" component="h1" gutterBottom>
          Tin tức công nghệ
        </HighlightTypography>
        <Typography variant="subtitle1" color="textSecondary">
          Khám phá những tin tức công nghệ mới nhất và hữu ích nhất
        </Typography>
      </Box>

      {/* Search Box */}
      <Box component="form" method="get" action="/blogs">
        <TextField
          fullWidth
          size="small"
          placeholder="Tìm kiếm bài viết..."
          name="search"
          defaultValue={search}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <BlogList posts={items} currentPage={pageIndex} totalPages={totalPages} />
    </Stack>
  );
}
