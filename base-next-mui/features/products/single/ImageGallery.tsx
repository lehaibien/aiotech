"use client";

import { Box, Paper } from "@mui/material";
import Image from "next/image";
import { useCallback, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import { Swiper as SwiperType } from "swiper/types";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

interface ImageGalleryProps {
  images: string[];
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  const thumbsSwiper = useRef<SwiperType | null>(null);
  const mainSwiper = useRef<SwiperType | null>(null);

  const setThumbsSwiper = useCallback((swiper: SwiperType) => {
    thumbsSwiper.current = swiper;
  }, []);

  const setMainSwiper = useCallback((swiper: SwiperType) => {
    mainSwiper.current = swiper;
  }, []);

  const handleThumbClick = useCallback((index: number) => {
    if (mainSwiper.current) {
      mainSwiper.current.slideTo(index);
    }
  }, []);

  return (
    <Box sx={{ width: "100%" }}>
      <Paper
        variant="outlined"
        sx={{
          aspectRatio: "1/1",
          position: "relative",
          bgcolor: "white",
          border: "none",
          overflow: "hidden",
          "& .swiper-button-next, .swiper-button-prev": {
            color: "primary.main",
            "&::after": {
              fontSize: "16px",
            },
            width: "24px",
            height: "24px",
            padding: 2,
            backgroundColor: "rgba(0, 0, 0, 0.25)",
            borderRadius: "50%",
          },
        }}
      >
        <Swiper
          onSwiper={setMainSwiper}
          spaceBetween={10}
          navigation={true}
          thumbs={{ swiper: thumbsSwiper.current }}
          modules={[FreeMode, Navigation, Thumbs]}
          style={{ height: "100%" }}
        >
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  p: 2,
                }}
              >
                <Image
                  src={image}
                  alt={`Product ${index + 1}`}
                  width={600}
                  height={600}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                  priority={index === 0}
                />
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>
      </Paper>

      <Box sx={{ mt: 1 }}>
        <Swiper
          onSwiper={setThumbsSwiper}
          spaceBetween={10}
          slidesPerView={4}
          freeMode={true}
          watchSlidesProgress={true}
          modules={[FreeMode, Navigation, Thumbs]}
        >
          {images.map((image, index) => (
            <SwiperSlide key={index} onClick={() => handleThumbClick(index)}>
              <Paper
                elevation={1}
                sx={{
                  aspectRatio: "1/1",
                  cursor: "pointer",
                  overflow: "hidden",
                  opacity: 0.7,
                  transition: "opacity 0.2s ease-in-out",
                  "&.swiper-slide-thumb-active": {
                    opacity: 1,
                    outline: (theme) => `2px solid ${theme.palette.primary.main}`,
                  },
                }}
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
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>
    </Box>
  );
}
