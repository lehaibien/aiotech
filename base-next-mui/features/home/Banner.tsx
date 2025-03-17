import { ArrowForward } from "@mui/icons-material";
import { Box, Button, Link, Typography } from "@mui/material";
import Image from "next/image";

type BannerProps = {
  title: string;
  description: string;
  imageUrl: string;
};

export function Banner({ title, description, imageUrl }: BannerProps) {
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
      {/* Next.js Image component */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 1, // Ensure the image is behind the text
        }}
      >
        <Image
          src={imageUrl || "/hero-banner.jpg"}
          alt="Banner Image"
          width={1600}
          height={400}
          quality={100}
          priority
          className="hidden md:block"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
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

      {/* Text and Button Overlay */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end", // Align text to the bottom
          alignItems: "flex-start", // Align text to the left
          p: 4,
          backgroundColor: "rgba(0,0,0,0.5)",
          color: "white",
          zIndex: 2, // Ensure the text is above the image
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            fontSize: "clamp(2rem, 10vw, 2.15rem)",
            mb: 2,
          }}
        >
          {title || "AioTech"}
        </Typography>
        <Typography
          variant="h5"
          gutterBottom
          sx={{
            lineHeight: 1.5,
            fontSize: "clamp(1.2rem, 10rem, 1.2rem)",
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
}
