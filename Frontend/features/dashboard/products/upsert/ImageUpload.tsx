"use client";

import { FileUpload } from "@/components/core/FileUpload";
import { IMAGE_TYPES } from "@/constant/common";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { Box, Divider, ImageList, ImageListItem, Stack } from "@mui/material";
import Image from "next/image";
import { useRef, useState } from "react";

type ImageUploadProps = {
  images: File[];
  onUpload: (files: File[]) => void;
  onDelete: (index: number) => void;
  onReorder?: (newOrder: File[]) => void;
};

export const ImageUpload = ({
  images,
  onUpload,
  onDelete,
  onReorder = () => {},
}: ImageUploadProps) => {
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const [dragOverItem, setDragOverItem] = useState<number | null>(null);
  const imageListRef = useRef<HTMLUListElement>(null);
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);

  const handleFileChange = (files: File[]) => {
    onUpload(Array.from(files));
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    if (imageRefs.current[index]) {
      const img = imageRefs.current[index];
      e.dataTransfer.setDragImage(
        img as HTMLElement,
        img?.width / 2 || 0,
        img?.height / 2 || 0
      );
    }
    setDraggedItem(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverItem(index);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (
      draggedItem === null ||
      dragOverItem === null ||
      draggedItem === dragOverItem
    ) {
      setDraggedItem(null);
      setDragOverItem(null);
      return;
    }

    const newImages = [...images];

    const temp = newImages[draggedItem];
    newImages[draggedItem] = newImages[dragOverItem];
    newImages[dragOverItem] = temp;

    onReorder(newImages);

    setDraggedItem(null);
    setDragOverItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverItem(null);
  };

  return (
    <Stack spacing={2}>
      <FileUpload
        required
        multiple
        onChange={handleFileChange}
        maxSize={10}
        name="files"
        fileTypes={IMAGE_TYPES}
      />
      <Divider className="my-4" />
      {images.length > 0 && (
        <ImageList
          ref={imageListRef}
          sx={{ width: "100%" }}
          cols={2}
          rowHeight="auto"
          draggable={false}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          {images.map((image, index) => (
            <ImageListItem
              key={index}
              draggable={false}
              onDragOver={(e) => handleDragOver(e, index)}
              sx={{
                aspectRatio: "1/1",
                position: "relative",
                cursor: "default",
                border: dragOverItem === index ? "2px dashed #1976d2" : "none",
                opacity: draggedItem === index ? 0.5 : 1,
                transition: "all 0.2s",
              }}
            >
              <Box
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragEnd={handleDragEnd}
                sx={{
                  position: "absolute",
                  top: 2,
                  left: 2,
                  zIndex: 1,
                  backgroundColor: "rgba(255,255,255,0.7)",
                  borderRadius: "4px",
                  padding: "2px",
                  cursor: "grab",
                }}
              >
                <DragIndicatorIcon color="primary" />
              </Box>
              <DeleteOutlineOutlinedIcon
                color="error"
                sx={{
                  position: "absolute",
                  top: 2,
                  right: 2,
                  cursor: "pointer",
                }}
                onClick={() => onDelete(index)}
              />
              <Image
                ref={(el: HTMLImageElement | null) => {
                  imageRefs.current[index] = el;
                }}
                src={URL.createObjectURL(image) || "/placeholder.svg"}
                alt={`Uploaded ${index + 1}`}
                loading="lazy"
                width={300}
                height={300}
                draggable={false}
                onDragStart={(e) => e.preventDefault()}
                style={{
                  objectFit: "fill",
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
