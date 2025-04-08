"use client";

import { formatDate } from "@/lib/utils";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  alpha,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";

type BlogCardProps = {
  id: string;
  title: string;
  imageUrl: string;
  createdDate: Date;
};

export default function BlogCard({
  id,
  title,
  imageUrl,
  createdDate,
}: BlogCardProps) {
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
        href={`/blogs/${id}`}
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
        }}
      >
        <CardMedia>
          <Image
            src={imageUrl}
            alt={title}
            width={1200}
            height={630}
            style={{
              aspectRatio: 1200 / 630,
              objectFit: "cover",
              objectPosition: "center",
            }}
          />
        </CardMedia>
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
            {title}
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
              {formatDate(createdDate)}
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
