"use client";

import { ControlledTextField } from "@/components/core/ControlledTextField";
import { API_URL } from "@/constant/apiUrl";
import { EMPTY_UUID } from "@/constant/common";
import { postApi, putApi } from "@/lib/apiClient";
import { convertObjectToFormData } from "@/lib/utils";
import { BrandRequestSchema } from "@/schemas/brandSchema";
import { BrandRequest, BrandResponse } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, FormControl, FormLabel, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ImageUpload from "./ImageUpload";

type BrandUpsertFormProps = {
  defaultValue: BrandResponse;
};

export const BrandUpsertForm = ({ defaultValue }: BrandUpsertFormProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const [image, setImage] = useState<File | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isImageChanged, setIsImageChanged] = useState(false);

  const { control, handleSubmit } = useForm<BrandRequest>({
    defaultValues: defaultValue,
    resolver: zodResolver(BrandRequestSchema),
  });
  const onSubmit = async (data: BrandRequest) => {
    setIsLoading(true);
    const request: BrandRequest = {
      ...data,
      image: image,
      isImageEdited: isImageChanged,
    };
    const formData = convertObjectToFormData(request);
    try {
      const action = data.id === EMPTY_UUID ? postApi : putApi;
      const method = data.id === EMPTY_UUID ? "Thêm mới" : "Cập nhật";
      const response = await action(API_URL.brand, formData);
      if (response.success) {
        enqueueSnackbar(method + " thương hiệu thành công", {
          variant: "success",
        });
        router.push("/dashboard/brands");
      } else {
        enqueueSnackbar(method + " thương hiệu thất bại", {
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
          Tên thương hiệu
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
          Ảnh thương hiệu
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
          href="/dashboard/brands"
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
            : defaultValue.id === EMPTY_UUID
            ? "Thêm mới"
            : "Cập nhật"}
        </Button>
      </FormControl>
    </form>
  );
};
