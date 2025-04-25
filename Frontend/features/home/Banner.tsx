import { IMAGE_ASPECT_RATIO } from "@/constant/imageAspectRatio";
import { ArrowForward } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";

type HeroBannerProps = {
  title: string;
  description: string;
  imageUrl: string;
};

export const HeroBanner = ({ title, description, imageUrl }: HeroBannerProps) => {
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: {
          xs: 200,
          md: 400,
        },
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 1,
        }}
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
        <Image
          src={imageUrl || "/hero-banner.jpg"}
          alt="Banner Image"
          width={600}
          height={200}
          quality={100}
          priority
          className="d-block md:hidden"
          style={{
            width: "100%",
            height: 200,
            objectFit: "cover",
          }}
        />
      </Box>

      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          alignItems: "flex-start",
          p: 4,
          backgroundColor: "rgba(0,0,0,0.5)",
          color: "white",
          zIndex: 2,
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom>
          {title || "AioTech"}
        </Typography>
        <Typography
          variant="body1"
          gutterBottom
          sx={{
            display: {
              xs: "none",
              md: "block",
            },
          }}
        >
          {description}
        </Typography>
        <Button
          LinkComponent={Link}
          href="/products"
          variant="contained"
          color="primary"
          size="large"
          endIcon={<ArrowForward />}
        >
          Mua ngay
        </Button>
      </Box>
    </Box>
  );
};
