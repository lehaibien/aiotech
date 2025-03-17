"use client";

import {
  Card,
  alpha,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  useTheme,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";

type CategoryCardProps = {
  name: string;
  imageUrl: string;
};

export function CategoryCard({ name, imageUrl }: CategoryCardProps) {
  const theme = useTheme();
  return (
    <Card
      sx={{
        position: "relative",
        overflow: "hidden",
        height: 200,
        borderRadius: 2,
        transition: "all 0.2s ease-in-out",
        boxShadow: "none",
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: theme.shadows[4],
          "& .category-image": {
            transform: "scale(1.05)",
          },
          "& .category-content": {
            backgroundColor: alpha(theme.palette.background.paper, 0.95),
          },
        },
      }}
    >
      <CardActionArea
        LinkComponent={Link}
        href={`products/?category=${name}`}
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <CardMedia
          sx={{
            position: "relative",
            height: "100%",
            overflow: "hidden",
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}
        >
          <Image
            src={imageUrl}
            width={600}
            height={400}
            alt={name}
            className="category-image"
            style={{
              objectFit: "fill",
              aspectRatio: 3 / 2,
              transition: "transform 0.3s ease-in-out",
            }}
            priority
          />
        </CardMedia>
        <CardContent
          className="category-content"
          sx={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            backgroundColor: alpha(theme.palette.background.paper, 0.85),
            transition: "background-color 0.2s ease-in-out",
            p: 1.5,
            minHeight: 56,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            variant="subtitle1"
            component="h3"
            sx={{
              fontWeight: 500,
              textAlign: "center",
              fontSize: { xs: "0.9rem", sm: "1rem" },
              color: theme.palette.text.primary,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              lineHeight: 1.2,
            }}
          >
            {name}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
