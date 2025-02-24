"use client";

import { Box, Grid2 as Grid, Paper } from "@mui/material";
import Image from "next/image";
import { useState } from "react";

interface ImageGalleryProps {
  images: string[];
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(images[0]);

  return (
    <Box>
      <Paper
        variant="outlined"
        sx={{
          mb: 2,
          p: 1,
          aspectRatio: "1/1",
          position: "relative",
          bgcolor: "white",
          border: "none",
        }}
      >
        <Image
          src={selectedImage}
          alt="Product"
          width={600}
          height={600}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
          priority
        />
      </Paper>
      <Grid container spacing={1}>
        {images.map((image, index) => (
          <Grid size={{ xs: 3 }} key={index}>
            <Paper
              elevation={1}
              sx={{
                aspectRatio: "1/1",
                p: 0.5,
                cursor: "pointer",
                border: image === selectedImage ? "2px solid" : "none",
                borderColor: "primary.main",
              }}
              onClick={() => setSelectedImage(image)}
            >
              <Image
                src={image}
                alt={`Product thumbnail ${index + 1}`}
                width={100}
                height={100}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
              />
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
