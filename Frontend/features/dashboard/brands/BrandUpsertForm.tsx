"use client";

import { API_URL } from "@/constant/apiUrl";
import { EMPTY_UUID } from "@/constant/common";
import { postApi, putApi } from "@/lib/apiClient";
import { convertObjectToFormData } from "@/lib/utils";
import { BrandRequest, BrandRequestSchema, BrandResponse } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, FormControl, FormLabel } from "@mui/material";
import TextField from "@mui/material/TextField";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ImageUpload from "./ImageUpload";

type BrandUpsertFormProps = {
  brand: BrandResponse;
};

export function BrandUpsertForm({ brand: data }: BrandUpsertFormProps) {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const [image, setImage] = useState<File | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BrandRequest>({
    defaultValues: data as BrandRequest,
    resolver: zodResolver(BrandRequestSchema),
  });
  const onSubmit = async (data: BrandRequest) => {
    setIsLoading(true);
    const request: BrandRequest = {
      ...data,
      image: image,
    };
    const formData = convertObjectToFormData(request);
    try {
      if (data.id === EMPTY_UUID) {
        const response = await postApi(API_URL.brand, formData);
        if (response.success) {
          enqueueSnackbar("Thêm mới thương hiệu thành công", {
            variant: "success",
          });
          // Use setTimeout to delay navigation
          setTimeout(() => {
            router.push("/dashboard/brands");
          }, 100);
        } else {
          enqueueSnackbar("Lỗi xảy ra: " + response.message, {
            variant: "error",
          });
        }
      } else {
        const response = await putApi(API_URL.brand, formData);
        if (response.success) {
          enqueueSnackbar("Cập nhật thương hiệu thành công", {
            variant: "success",
          });
          // Use setTimeout to delay navigation
          setTimeout(() => {
            router.push("/dashboard/brands");
          }, 100);
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
      if (!url) return undefined;

      try {
        // Replace docker internal host with localhost if needed
        const imageUrl = url.includes("host.docker.internal")
          ? url.replace("host.docker.internal", "localhost")
          : url;

        const response = await fetch(imageUrl, {
          mode: "cors", // Enable CORS
        });

        if (!response.ok) throw new Error("Failed to fetch image");

        const blob = await response.blob();
        return new File([blob], url.substring(url.lastIndexOf("/") + 1));
      } catch (err) {
        console.error("Image fetch error:", err);
        return undefined;
      }
    };

    getImage(data.imageUrl)
      .then(setImage)
      .catch((err) => console.error("Image processing error:", err));
  }, [data.imageUrl]);
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
          Tên thương hiệu
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
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 1,
        }}
      >
        <FormLabel htmlFor="name" required>
          Ảnh thương hiệu
        </FormLabel>
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
          variant="contained"
          color="inherit"
          LinkComponent={Link}
          href="/dashboard/brands"
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
            : data.id === EMPTY_UUID
            ? "Thêm mới"
            : "Cập nhật"}
        </Button>
      </FormControl>
    </Box>
  );
}
