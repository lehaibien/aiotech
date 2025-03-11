"use client";

import { API_URL } from "@/constant/apiUrl";
import { EMPTY_UUID } from "@/constant/common";
import { postApi, putApi } from "@/lib/apiClient";
import {
  CategoryRequest,
  CategoryRequestSchema,
  CategoryResponse,
} from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, FormControl, FormLabel, Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { useForm } from "react-hook-form";
import ImageUpload from "./ImageUpload";
import { useEffect, useState } from "react";
import { convertObjectToFormData } from "@/lib/utils";

type CategoryUpsertFormProps = {
  category: CategoryResponse;
};

function CategoryUpsertForm({ category }: CategoryUpsertFormProps) {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const [image, setImage] = useState<File | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryRequest>({
    defaultValues: category as CategoryRequest,
    resolver: zodResolver(CategoryRequestSchema),
  });
  const onSubmit = async (data: CategoryRequest) => {
    setIsLoading(true);
    const request: CategoryRequest = {
      ...data,
      image: image,
    };
    const formData = convertObjectToFormData(request);
    try {
      if (category.id === EMPTY_UUID) {
        const response = await postApi(API_URL.category, formData);
        if (response.success) {
          enqueueSnackbar("Thêm mới danh mục thành công", {
            variant: "success",
          });
          router.push("/dashboard/categories");
        } else {
          enqueueSnackbar("Lỗi xảy ra: " + response.message, {
            variant: "error",
          });
        }
      } else {
        const response = await putApi(API_URL.category, formData);
        if (response.success) {
          enqueueSnackbar("Cập nhật danh mục thành công", {
            variant: "success",
          });
          router.push("/dashboard/categories");
        } else {
          enqueueSnackbar("Lỗi xảy ra: " + response.message, {
            variant: "error",
          });
        }
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
      if (url === "") {
        return undefined;
      }
      const response = await fetch(url);
      const blob = await response.blob();
      return new File([blob], url.substring(url.lastIndexOf("/") + 1));
    };
    getImage(category.imageUrl)
      .then((image) => setImage(image))
      .catch((err) => console.error(err));
  }, [category.imageUrl]);
  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <TextField
        type="hidden"
        sx={{
          display: "none",
        }}
        {...register("id")}
      />
      <FormControl margin="normal" fullWidth>
        <FormLabel htmlFor="name" required>
          Tên danh mục
        </FormLabel>
        <TextField
          id="name"
          required
          {...register("name")}
          error={errors.name ? true : false}
          helperText={errors.name ? errors.name.message : undefined}
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
        <ImageUpload image={image} onUpload={setImage} />
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
    </Box>
  );
}

export default CategoryUpsertForm;
