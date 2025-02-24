"use client";

import { API_URL } from "@/constant/apiUrl";
import { EMPTY_UUID } from "@/constant/common";
import { postApi, putApi } from "@/lib/apiClient";
import { BrandRequest, BrandRequestSchema, BrandResponse } from "@/types";
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

type BrandUpsertFormProps = {
  brand: BrandResponse;
};

function BrandUpsertForm({ brand: data }: BrandUpsertFormProps) {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const [image, setImage] = useState<File | undefined>(undefined);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BrandRequest>({
    defaultValues: data as BrandRequest,
    resolver: zodResolver(BrandRequestSchema),
  });
  const onSubmit = async (data: BrandRequest) => {
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
          router.push("/dashboard/brands");
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
          router.push("/dashboard/brands");
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
    getImage(data.imageUrl)
      .then((image) => setImage(image))
      .catch((err) => console.error(err));
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
          width: "30%",
        }}
      >
        <Typography variant="h6" className="mb-4">
          Ảnh thương hiệu
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
          variant="contained"
          color="inherit"
          LinkComponent={Link}
          href="/dashboard/brands"
        >
          Hủy
        </Button>
        <Button type="submit" variant="contained" color="primary">
          {data.id === EMPTY_UUID ? "Thêm mới" : "Cập nhật"}
        </Button>
      </FormControl>
    </Box>
  );
}

export default BrandUpsertForm;
