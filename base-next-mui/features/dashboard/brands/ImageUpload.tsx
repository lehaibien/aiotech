import { Button, Stack } from "@mui/material";
import Image from "next/image";
import React from "react";

interface ImageUploadProps {
  onUpload: (file: File) => void;
  image?: File | undefined;
}

function ImageUpload({ onUpload, image }: ImageUploadProps) {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      onUpload(Array.from(event.target.files)[0]);
    }
  };
  return (
    <Stack spacing={2}>
      <Button variant="contained" component="label" className="mb-4">
        Tải ảnh lên
        <input
          type="file"
          hidden
          onChange={handleFileChange}
          accept="image/*"
        />
      </Button>
      {image && (
        <Image
          src={URL.createObjectURL(image) || "/image-not-found.jpg"}
          alt={`Uploaded`}
          width={300}
          height={0}
          style={{
            width: 'auto',
            height: 'auto',
            aspectRatio: 4 / 3,
            objectFit: 'contain',
            backgroundColor: 'white',
          }}
        />
      )}
    </Stack>
  );
}

export default React.memo(ImageUpload, (prev, next) => {
  if (
    prev.image?.name === next.image?.name &&
    prev.image?.size === next.image?.size
  ) {
    return true;
  }
  return false;
});
