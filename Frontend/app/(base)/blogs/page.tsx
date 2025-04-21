import "server-only";

import { API_URL } from "@/constant/apiUrl";
import BlogList from "@/features/blog/BlogList";
import { getListApi } from "@/lib/apiClient";
import { PaginatedList, SearchParams } from "@/types";
import { PostPreviewResponse } from "@/types/post";
import ArticleIcon from "@mui/icons-material/Article";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Breadcrumbs,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Metadata } from "next";
import Link from "next/link";

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
    <>
      {/* Breadcrumbs Navigation */}
      <Box mb={2}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            <HomeIcon sx={{ mr: 0.5 }} fontSize="small" />
            Trang chủ
          </Link>
          <Typography
            color="text.primary"
            sx={{ display: "flex", alignItems: "center" }}
          >
            <ArticleIcon sx={{ mr: 0.5 }} fontSize="small" />
            Tin tức công nghệ
          </Typography>
        </Breadcrumbs>
      </Box>

      <Stack gap={2}>
        <Box>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              position: "relative",
              display: "inline-block",
              "&::after": {
                content: '""',
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "50%",
                height: "4px",
                backgroundColor: "primary.main",
                borderRadius: "2px",
              },
            }}
          >
            Tin tức công nghệ
          </Typography>
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

        <BlogList
          posts={items}
          currentPage={pageIndex}
          totalPages={totalPages}
        />
      </Stack>
    </>
  );
}
