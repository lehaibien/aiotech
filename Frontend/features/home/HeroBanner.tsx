import { IMAGE_ASPECT_RATIO } from "@/constant/imageAspectRatio";
import { Box, Button, Text, Stack, Title } from "@mantine/core";
import { ArrowRight } from "@mui/icons-material";
import Image from "next/image";
import Link from "next/link";

type HeroBannerProps = {
  title: string;
  description: string;
  imageUrl: string;
};

export const HeroBanner = ({
  title,
  description,
  imageUrl,
}: HeroBannerProps) => {
  return (
    <Box
      pos="relative"
      w="100%"
      h={{
        base: 200,
        md: 400,
      }}
      style={{
        borderRadius: 8,
        overflow: "hidden",
      }}
    >
      <Box
        pos="absolute"
        top={0}
        left={0}
        w="100%"
        h="100%"
        style={{ zIndex: 1 }}
      >
        <Image
          src={imageUrl || "/hero-banner.jpg"}
          alt="Banner Image"
          width={1200}
          height={400}
          quality={100}
          priority
          className="hidden md:block"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "fill",
            aspectRatio: IMAGE_ASPECT_RATIO.BANNER,
          }}
        />
      </Box>

      <Stack
        pos="absolute"
        top={0}
        left={0}
        w="100%"
        h="100%"
        justify="flex-end"
        align="flex-start"
        c='white'
        p={16}
        style={{
          backgroundColor: "rgba(0,0,0,0.5)",
          zIndex: 2,
        }}
      >
        <Stack gap={8}>
          <Title order={1}>{title || "AioTech"}</Title>
          <Text
            display={{
              xs: "none",
              md: "block",
            }}
          >
            {description}
          </Text>
          <Button
            component={Link}
            href="/products"
            variant="filled"
            size="md"
            rightSection={<ArrowRight height={16} />}
          >
            Mua ngay
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};
