"use client";

import Image from "next/image";
import { useCallback, useRef } from "react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from "swiper/types";

import { Group, Paper } from "@mantine/core";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

type ImageGalleryProps = {
  images: string[];
};

export const ImageGallery = ({ images }: ImageGalleryProps) => {
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
    <>
      <Paper
        withBorder
        style={{
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
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
              <Group justify="center" align="center" p={4}>
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
              </Group>
            </SwiperSlide>
          ))}
        </Swiper>
      </Paper>

      <Paper
        withBorder
        style={{
          borderTop: 0,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
        }}
      >
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
            </SwiperSlide>
          ))}
        </Swiper>
      </Paper>
    </>
  );
};
