"use client";

import { IMAGE_ASPECT_RATIO } from "@/constant/imageAspectRatio";
import dayjs from "@/lib/extended-dayjs";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";

type BlogPostItemProps = {
  title: string;
  slug: string;
  imageUrl: string;
  createdDate: Date;
  imgHeight?: number;
};

export default function BlogPostItem({
  title,
  slug,
  imageUrl,
  createdDate,
  imgHeight = 200,
}: BlogPostItemProps) {
  const postDate = dayjs(createdDate);
  const formattedDate = postDate.format("DD/MM/YYYY");
  const hours = postDate.format("HH");
  const minutes = postDate.format("mm");
  return (
    <Card>
      <CardActionArea LinkComponent={Link} href={`/blogs/${slug}`}>
        <CardMedia
          component="div"
          sx={{
            height: imgHeight,
            overflow: "hidden",
          }}
        >
          <Image
            src={imageUrl}
            alt={title}
            height={800}
            width={1200}
            priority
            style={{
              objectFit: "fill",
              width: "100%",
              height: "100%",
              aspectRatio: IMAGE_ASPECT_RATIO.BLOG,
            }}
          />
        </CardMedia>

        <CardContent sx={{ py: 1, px: 2 }}>
          <Typography
            component="h3"
            variant="h6"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {title}
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              mt: "auto",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              <CalendarTodayIcon fontSize="small" />
              <Typography variant="caption">{formattedDate}</Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              <AccessTimeIcon fontSize="small" />
              <Typography variant="caption">
                {hours}:{minutes}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
