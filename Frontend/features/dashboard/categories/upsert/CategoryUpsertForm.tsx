"use client";

import { MantineImageUploader } from "@/components/core/MantineImageUploader";
import { ControlledTextInput } from "@/components/form/ControlledTextField";
import { API_URL } from "@/constant/apiUrl";
import { EMPTY_UUID } from "@/constant/common";
import { IMAGE_ASPECT_RATIO } from "@/constant/image";
import { postApi, putApi } from "@/lib/apiClient";
import { convertObjectToFormData } from "@/lib/utils";
import { categoryRequestSchema } from "@/schemas/categorySchema";
import { CategoryRequest, CategoryResponse } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Group, Input, Stack } from "@mantine/core";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

type CategoryUpsertFormProps = {
  defaultValue: CategoryResponse;
};

export const CategoryUpsertForm = ({
  defaultValue,
}: CategoryUpsertFormProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const [image, setImage] = useState<File | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isImageChanged, setIsImageChanged] = useState(false);

  const { control, handleSubmit } = useForm<CategoryRequest>({
    defaultValues: defaultValue,
    resolver: zodResolver(categoryRequestSchema),
  });
  const onSubmit = async (data: CategoryRequest) => {
    setIsLoading(true);
    const request: CategoryRequest = {
      ...data,
      image: image,
      isImageEdited: isImageChanged,
    };
    const formData = convertObjectToFormData(request);
    try {
      const action = data.id === EMPTY_UUID ? postApi : putApi;
      const method = data.id === EMPTY_UUID ? "Thêm mới" : "Cập nhật";
      const response = await action(API_URL.category, formData);
      if (response.success) {
        enqueueSnackbar(method + " danh mục thành công", {
          variant: "success",
        });
        router.push("/dashboard/categories");
      } else {
        enqueueSnackbar(method + " danh mục thất bại: " + response.message, {
          variant: "error",
        });
      }
    } catch (err) {
      enqueueSnackbar("Lỗi xảy ra: " + (err as Error).message, {
        variant: "error",
      });
    }
    setIsLoading(false);
  };
  useEffect(() => {
    const getImage = async (url: string) => {
      if (!url) return undefined;
      try {
        const response = await fetch(url, {
          mode: "cors",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch image");
        }

        const blob = await response.blob();
        return new File([blob], url.substring(url.lastIndexOf("/") + 1));
      } catch (err) {
        console.error("Image fetch error:", err);
        return undefined;
      }
    };

    getImage(defaultValue.imageUrl)
      .then(setImage)
      .catch((err) => console.error("Image processing error:", err));
  }, [defaultValue.imageUrl]);
  return (
    <Stack component="form" onSubmit={handleSubmit(onSubmit)}>
      <ControlledTextInput control={control} name="id" type="hidden" />
      <ControlledTextInput
        control={control}
        name="name"
        required
        size="sm"
        label="Tên danh mục"
      />
      <div>
        <Input.Label required>Hình ảnh</Input.Label>
        <MantineImageUploader
          onDrop={(files) => {
            setImage(files[0]);
            setIsImageChanged(true);
          }}
        />
        <Image
          src={image ? URL.createObjectURL(image) : "/image-not-found.jpg"}
          width={600}
          height={400}
          alt="hero banner"
          style={{
            marginTop: 8,
            objectFit: "fill",
            maxWidth: "100%",
            maxHeight: "100%",
            aspectRatio: IMAGE_ASPECT_RATIO.BRANDING,
          }}
        />
      </div>
      <Group justify="flex-end">
        <Button
          type="button"
          component={Link}
          href="/dashboard/categories"
          variant="filled"
          color="red"
          disabled={isLoading}
        >
          Hủy
        </Button>
        <Button
          type="submit"
          variant="filled"
          disabled={isLoading}
          loading={isLoading}
        >
          {defaultValue.id === EMPTY_UUID ? "Thêm mới" : "Cập nhật"}
        </Button>
      </Group>
    </Stack>
  );
};
