"use client";

import { MantineImageUploader } from "@/components/core/MantineImageUploader";
import { IMAGE_TYPES } from "@/constant/common";
import { Box, Group, SimpleGrid, Stack } from "@mantine/core";
import { GripVertical, Trash } from "lucide-react";
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
  const imageListRef = useRef<HTMLDivElement>(null);
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
    <Stack gap="md">
      <MantineImageUploader
        onDrop={handleFileChange}
        maxSize={10 * 1024 ** 2}
        accept={IMAGE_TYPES}
        multiple
      />
      {images.length > 0 && (
        <SimpleGrid
          cols={2}
          ref={imageListRef}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          {images.map((image, index) => (
            <Box
              key={index}
              pos="relative"
              onDragOver={(e) => handleDragOver(e, index)}
              style={{
                aspectRatio: "1/1",
                cursor: "default",
                border:
                  dragOverItem === index
                    ? "2px dashed var(--mantine-color-blue-6)"
                    : "none",
                opacity: draggedItem === index ? 0.5 : 1,
                transition: "all 0.2s",
              }}
            >
              <Group
                wrap="nowrap"
                gap="xs"
                pos="absolute"
                top={5}
                left={5}
                style={{ zIndex: 1 }}
              >
                <Box
                  component="span"
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragEnd={handleDragEnd}
                  bg="white"
                  style={{ cursor: "grab", borderRadius: 4, padding: 2 }}
                >
                  <GripVertical size={20} color="var(--mantine-color-blue-6)" />
                </Box>
                <Box
                  component="span"
                  onClick={() => onDelete(index)}
                  bg="white"
                  style={{ cursor: "pointer", borderRadius: 4, padding: 2 }}
                >
                  <Trash size={20} color="var(--mantine-color-red-6)" />
                </Box>
              </Group>
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
            </Box>
          ))}
        </SimpleGrid>
      )}
    </Stack>
  );
};
