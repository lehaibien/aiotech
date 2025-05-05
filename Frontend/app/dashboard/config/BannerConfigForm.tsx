"use client";

import { MantineImageUploader } from "@/components/core/MantineImageUploader";
import { ControlledTextarea } from "@/components/form/ControlledTextarea";
import { ControlledTextInput } from "@/components/form/ControlledTextField";
import { API_URL } from "@/constant/apiUrl";
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from "@/constant/common";
import { IMAGE_ASPECT_RATIO } from "@/constant/imageAspectRatio";
import { useGetImage } from "@/hooks/useGetImage";
import { postApi } from "@/lib/apiClient";
import { convertObjectToFormData } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, SimpleGrid, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const bannerSchema = z.object({
  title: z.string().min(1, "Vui lòng nhập tiêu đề"),
  description: z.string().min(1, "Vui lòng nhập mô tả"),
  image: z
    .any()
    .refine((value) => value instanceof File, {
      message: "Ảnh không hợp lệ",
    })
    .refine((images) => images.size <= MAX_FILE_SIZE, {
      message: `Dung lượng ảnh không được vượt quá ${
        MAX_FILE_SIZE / 1024 / 1024
      }MB`,
    })
    .refine((images) => ACCEPTED_IMAGE_TYPES.includes(images.type), {
      message: `Định dạng ảnh không hợp lệ. Chỉ chấp nhận ${ACCEPTED_IMAGE_TYPES.join(
        ", "
      )}`,
    })
    .optional(),
  isImageEdited: z.boolean().optional(),
});

export type BannerFormData = z.infer<typeof bannerSchema>;

type BannerConfigFormProps = {
  title: string;
  description: string;
  imageUrl: string;
};

export const BannerConfigForm = ({
  title,
  description,
  imageUrl,
}: BannerConfigFormProps) => {
  const [image, setImage] = useState<File | undefined>(undefined);
  const { control, handleSubmit } = useForm({
    resolver: zodResolver(bannerSchema),
    defaultValues: {
      title,
      description,
    },
  });
  const onSubmit = async (data: BannerFormData) => {
    data.image = image;
    const formData = convertObjectToFormData(data);
    const response = await postApi(API_URL.bannerConfig, formData);
    if (response.success) {
      notifications.show({
        message: "Lưu cấu hình banner thành công",
        color: "green",
      });
    } else {
      notifications.show({
        message: "Lưu cấu hình banner thất bại",
        color: "red",
      });
    }
  };

  const { images } = useGetImage(imageUrl);
  useEffect(() => {
    if (images.length > 0) {
      setImage(images[0]);
    }
  }, [images]);
  return (
    <>
      <Title order={6}>Cấu Hình Banner</Title>
      <SimpleGrid cols={1} component="form" onSubmit={handleSubmit(onSubmit)}>
        <ControlledTextInput
          name="title"
          control={control}
          size="sm"
          label="Tiêu đề"
          required
        />
        <ControlledTextarea
          name="description"
          control={control}
          rows={4}
          size="sm"
          required
          label="Mô tả"
        />
        <div>
          <Input.Label required>Hình ảnh</Input.Label>
          <MantineImageUploader onDrop={(files) => setImage(files[0])} />
          <Image
            src={image ? URL.createObjectURL(image) : "/image-not-found.jpg"}
            width={1200}
            height={400}
            alt="hero banner"
            style={{
              marginTop: 8,
              objectFit: 'fill',
              aspectRatio: IMAGE_ASPECT_RATIO.BANNER
            }}
          />
        </div>
        <Button type="submit" w="25%">
          Lưu cấu hình
        </Button>
      </SimpleGrid>
    </>
  );
};
