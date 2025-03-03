"use client";

import { PostPreviewResponse } from "@/types/post";
import { formatDate } from "@/lib/utils";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  alpha,
} from "@mui/material";
import Link from "next/link";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

type BlogCardProps = {
  post: PostPreviewResponse;
};

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.3s, box-shadow 0.3s",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: (theme) =>
            `0 10px 20px ${alpha(theme.palette.primary.main, 0.15)}`,
        },
      }}
      elevation={2}
    >
      <CardActionArea
        component={Link}
        href={`/blogs/${post.id}`}
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
        }}
      >
        <CardMedia
          component="img"
          height="200"
          image={post.imageUrl || "/image-not-found.jpg"}
          alt={post.title}
          sx={{
            objectFit: "cover",
          }}
        />
        <CardContent
          sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
        >
          <Typography
            gutterBottom
            variant="h6"
            component="h2"
            sx={{
              fontWeight: 600,
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              mb: 1,
              lineHeight: 1.4,
              height: "2.8em",
            }}
          >
            {post.title}
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mt: "auto",
              color: "text.secondary",
              fontSize: "0.875rem",
            }}
          >
            <CalendarTodayIcon sx={{ fontSize: "1rem", mr: 0.5 }} />
            <Typography variant="body2" color="text.secondary">
              {formatDate(new Date(post.createdDate))}
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
