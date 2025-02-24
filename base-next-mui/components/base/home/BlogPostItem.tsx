"use client";

import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { UUID } from "crypto";
import Image from "next/image";
import Link from "next/link";

interface BlogPostItemProps {
  id: UUID;
  title: string;
  imageUrl: string;
  createdDate: Date;
}

function BlogPostItem({ id, title, imageUrl, createdDate }: BlogPostItemProps) {
  const theme = useTheme();
  const date = new Date(createdDate);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Card
      sx={{
        transition: "transform 0.3s ease-in-out",
        "&:hover ": {},
      }}
    >
      <CardActionArea LinkComponent={Link} href={`/blog/${id}`}>
        <CardMedia
          component="div"
          style={{ position: "relative", height: isMobile ? 100 : 240 }}
        >
          <Image
            src={imageUrl}
            alt={title}
            height={500}
            width={1200}
            priority
            style={{
              objectFit: "cover",
              width: "100%",
              height: "100%",
              aspectRatio: 16 / 9,
            }}
          />
        </CardMedia>
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            minHeight: 90,
          }}
        >
          <Typography
            gutterBottom
            component="h3"
            variant="body1"
            sx={{
              fontWeight: 600,
            }}
          >
            {title}
          </Typography>
          <Typography variant="caption">
            Ngày {date.toLocaleDateString()} lúc{" "}
            {date.getHours().toLocaleString()} giờ
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default BlogPostItem;
