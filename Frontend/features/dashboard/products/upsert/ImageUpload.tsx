import React from "react";
import {
  Button,
  ImageList,
  ImageListItem,
  Divider,
  Stack,
} from "@mui/material";
import Image from "next/image";

interface ImageUploadProps {
  onUpload: (files: File[]) => void;
  images: File[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onUpload, images }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      onUpload(Array.from(event.target.files));
    }
  };

  return (
    <Stack spacing={2}>
      <Button variant="contained" component="label" size="small" sx={{width: "45%"}}>
        Tải ảnh lên
        <input
          type="file"
          hidden
          multiple
          onChange={handleFileChange}
          accept="image/*"
        />
      </Button>
      <Divider className="my-4" />
      {images.length > 0 && (
        <ImageList sx={{ width: "100%" }} cols={2} rowHeight="auto">
          {images.map((image, index) => (
            <ImageListItem key={index} sx={{ aspectRatio: "1/1" }}>
              <Image
                src={URL.createObjectURL(image) || "/placeholder.svg"}
                alt={`Uploaded ${index + 1}`}
                loading="lazy"
                width={200}
                height={200}
                style={{
                  objectFit: "cover",
                  width: "100%",
                  height: "100%",
                  backgroundColor: "white",
                }}
              />
            </ImageListItem>
          ))}
        </ImageList>
      )}
    </Stack>
  );
};

export default React.memo(ImageUpload, (prev, next) => {
  if (prev.images.length !== next.images.length) {
    return false;
  }
  prev.images.forEach((img, idx) => {
    if (
      img.name === next.images[idx].name &&
      img.size === next.images[idx].size
    ) {
      return false;
    }
  });
  return true;
});
