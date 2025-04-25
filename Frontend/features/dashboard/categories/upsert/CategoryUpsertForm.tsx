"use client";

import { ControlledTextField } from "@/components/core/ControlledTextField";
import { API_URL } from "@/constant/apiUrl";
import { EMPTY_UUID } from "@/constant/common";
import { postApi, putApi } from "@/lib/apiClient";
import { convertObjectToFormData } from "@/lib/utils";
import { categoryRequestSchema } from "@/schemas/categorySchema";
import { CategoryRequest, CategoryResponse } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, FormControl, FormLabel, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ImageUpload from "./ImageUpload";

type CategoryUpsertFormProps = {
  category: CategoryResponse;
};

export const CategoryUpsertForm = ({ category }: CategoryUpsertFormProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const [image, setImage] = useState<File | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isImageChanged, setIsImageChanged] = useState(false);
  const { control, handleSubmit } = useForm<CategoryRequest>({
    defaultValues: category as CategoryRequest,
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
      const action = category.id === EMPTY_UUID ? postApi : putApi;
      const response = await action(API_URL.category, formData);
      if (response.success) {
        const message = category.id === EMPTY_UUID ? "Thêm mới" : "Cập nhật";
        enqueueSnackbar(message + " danh mục thành công", {
          variant: "success",
        });
        router.push("/dashboard/categories");
      } else {
        enqueueSnackbar("Lỗi xảy ra: " + response.message, {
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
        const response = await fetch(url);

        if (!response.ok) throw new Error("Failed to fetch image");

        const blob = await response.blob();
        return new File([blob], url.substring(url.lastIndexOf("/") + 1));
      } catch (err) {
        console.error("Image fetch error:", err);
        return undefined;
      }
    };

    getImage(category.imageUrl)
      .then(setImage)
      .catch((err) => console.error("Image processing error:", err));
  }, [category.imageUrl]);
  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <ControlledTextField
        control={control}
        name="id"
        type="hidden"
        sx={{
          display: "none",
        }}
      />
      <FormControl margin="normal" fullWidth>
        <FormLabel htmlFor="name" required>
          Tên danh mục
        </FormLabel>
        <ControlledTextField
          control={control}
          name="name"
          required
          fullWidth
          size="small"
        />
      </FormControl>
      <FormControl
        margin="normal"
        sx={{
          width: "30%",
        }}
      >
        <Typography variant="h6" className="mb-4">
          Ảnh danh mục
        </Typography>
        <ImageUpload
          image={image}
          onUpload={(img) => {
            setIsImageChanged(true);
            setImage(img);
          }}
        />
      </FormControl>
      <FormControl
        margin="normal"
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          gap: 1,
        }}
        fullWidth
      >
        <Button
          type="button"
          LinkComponent={Link}
          href="/dashboard/categories"
          variant="contained"
          disabled={isLoading}
        >
          Hủy
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isLoading}
        >
          {isLoading
            ? "Đang xử lý..."
            : category.id === EMPTY_UUID
            ? "Thêm mới"
            : "Cập nhật"}
        </Button>
      </FormControl>
    </form>
  );
};
