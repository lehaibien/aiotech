"use client";

import { Group, Stack, Text } from "@mantine/core";
import { Dropzone, DropzoneProps, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { ImageIcon, UploadCloud, X } from "lucide-react";

type MantineImageUploaderProps = {
  onDrop: (files: File[]) => void;
} & Partial<DropzoneProps>;

export const MantineImageUploader = ({
  onDrop,
  ...props
}: MantineImageUploaderProps) => {
  const handleDrop = (files: File[]) => {
    onDrop(files);
  };
  return (
    <Dropzone
      onDrop={handleDrop}
      onReject={(files) => console.log(files)}
      maxSize={5 * 1024 ** 2}
      accept={IMAGE_MIME_TYPE}
      {...props}
    >
      <Group
        justify="center"
        gap="md"
        mih={120}
        style={{ pointerEvents: "none" }}
      >
        <Dropzone.Accept>
          <UploadCloud size={48} />
        </Dropzone.Accept>
        <Dropzone.Reject>
          <X size={48} />
        </Dropzone.Reject>
        <Dropzone.Idle>
          <ImageIcon size={48} />
        </Dropzone.Idle>

        <Stack gap='sm'>
          <Text size="sm">Thả hình ảnh vào đây hoặc chọn tệp để tải lên</Text>
          <Text size="sm">
            Chỉ chấp nhận hình ảnh có định dạng JPG, JPEG, PNG, GIF, WEBP và
            kích thước không quá 5mb
          </Text>
        </Stack>
      </Group>
    </Dropzone>
  );
};
