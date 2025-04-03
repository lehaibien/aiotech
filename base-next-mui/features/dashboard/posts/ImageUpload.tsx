import { Box, Button, Stack } from "@mui/material";
import Image from "next/image";
import React from "react";

interface ImageUploadProps {
  onUpload: (file: File) => void;
  image?: File | undefined;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onUpload, image }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      onUpload(Array.from(event.target.files)[0]);
    }
  };
  return (
    <Stack spacing={2}>
      <Button
        variant="contained"
        component="label"
        sx={{
          width: 200,
          mb: 2,
        }}
      >
        Tải ảnh lên
        <input
          type="file"
          hidden
          onChange={handleFileChange}
          accept="image/*"
        />
      </Button>
      <Box
        sx={(theme) => ({
          width: 1200,
          height: 630,
          border: `1px solid ${theme.palette.divider}`,
          position: "relative",
        })}
      >
        {image ? (
          <Image
            src={URL.createObjectURL(image) || "/placeholder.svg"}
            alt={`Uploaded`}
            loading="lazy"
            width={1200}
            height={630}
            style={{
              width: "auto",
              height: "auto",
              aspectRatio: 1200 / 630,
              objectFit: "fill",
              backgroundColor: "white",
            }}
          />
        ) : (
          <span
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            Chưa có ảnh
          </span>
        )}
      </Box>
    </Stack>
  );
};

export default React.memo(ImageUpload, (prev, next) => {
  if (
    prev.image?.name === next.image?.name &&
    prev.image?.size === next.image?.size
  ) {
    return true;
  }
  return false;
});
