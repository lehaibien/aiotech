"use client";

import { API_URL } from "@/constant/apiUrl";
import { EMPTY_UUID } from "@/constant/common";
import { postApi, putApi } from "@/lib/apiClient";
import { convertObjectToFormData } from "@/lib/utils";
import { PostRequest, PostRequestSchema, PostResponse } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Divider,
  FormLabel,
  Grid2 as Grid,
  Typography,
} from "@mui/material";
import { MuiChipsInput } from "mui-chips-input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { useEffect, useRef, useState } from "react";
import { SwitchElement, TextFieldElement, useForm } from "react-hook-form-mui";
import RichTextEditor, {
  RichTextEditorRef,
} from "@/components/core/RichTextEditor";
import ImageUpload from "./ImageUpload";

type PostUpsertFormProps = {
  post: PostResponse;
};

export function PostUpsertForm({ post }: PostUpsertFormProps) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const rteRef = useRef<RichTextEditorRef>(null);
  const { control, handleSubmit } = useForm<PostRequest>({
    defaultValues: post as PostRequest,
    resolver: zodResolver(PostRequestSchema),
  });
  const [chips, setChips] = useState<string[]>(post.tags);
  const [image, setImage] = useState<File>();
  const [isLoading, setIsLoading] = useState(false);

  const handleChipChange = (newChips: string[]) => {
    if (chips.includes(newChips[newChips.length - 1])) {
      return;
    }
    setChips(() => newChips);
  };

  const handleImageUpload = (newImage: File) => {
    setImage(newImage);
  };
  const onSubmit = async (data: PostRequest) => {
    setIsLoading(true);
    const request: PostRequest = {
      ...data,
      content: rteRef.current?.content ?? "",
      image: image,
      tags: chips,
    };
    const formData = convertObjectToFormData(request);
    if (post.id === EMPTY_UUID) {
      const response = await postApi(API_URL.post, formData);
      if (response.success) {
        enqueueSnackbar("Thêm mới bài viết thành công", {
          variant: "success",
        });
        router.push("/dashboard/posts");
      } else {
        enqueueSnackbar(response.message, { variant: "error" });
      }
    } else {
      const response = await putApi(API_URL.post, formData);
      if (response.success) {
        enqueueSnackbar("Cập nhật bài viết thành công", {
          variant: "success",
        });
        router.push("/dashboard/posts");
      } else {
        enqueueSnackbar(response.message, { variant: "error" });
      }
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
    getImage(post.imageUrl)
      .then((image) => setImage(image))
      .catch((err) => console.error(err));
  }, [post.imageUrl]);
  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Grid container spacing={2} alignItems="center">
        <Grid size={{ xs: 12, md: 8 }}>
          <FormLabel required htmlFor="title">
            Tiêu đề
          </FormLabel>
          <TextFieldElement control={control} name="title" required fullWidth />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FormLabel htmlFor="tags">Thẻ</FormLabel>
          <MuiChipsInput
            name="tags"
            fullWidth
            value={chips}
            onChange={handleChipChange}
            placeholder="Nhập thẻ và nhấn enter"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <SwitchElement
            control={control}
            name="isPublished"
            label="Xuất bản"
            sx={{
              ml: 4,
              height: "100%",
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 12 }}>
          <FormLabel htmlFor="image">Ảnh bìa</FormLabel>
          <ImageUpload onUpload={handleImageUpload} image={image} />
        </Grid>
        <Grid size={{ xs: 12, md: 12 }}>
          <Typography variant="h6" className="mb-4">
            Nội dung
          </Typography>
          <RichTextEditor ref={rteRef} defaultContent={post.content} />
        </Grid>
      </Grid>
      <Divider />
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          gap: 1,
          mt: 2,
        }}
      >
        <Button
          LinkComponent={Link}
          href="/dashboard/posts"
          type="button"
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
          {isLoading ? "Đang xử lý..." : post.id === EMPTY_UUID ? "Thêm mới" : "Cập nhật"}
        </Button>
      </Box>
    </form>
  );
}
