"use client";

import ControlledComboBox from "@/components/core/ControlledComboBox";
import { ControlledTextField } from "@/components/core/ControlledTextField";
import RichTextEditor, {
  RichTextEditorRef,
} from "@/components/core/RichTextEditor";
import { API_URL } from "@/constant/apiUrl";
import { EMPTY_UUID } from "@/constant/common";
import { postApi, putApi } from "@/lib/apiClient";
import { convertObjectToFormData } from "@/lib/utils";
import { postRequestSchema } from "@/schemas/postSchema";
import { PostRequest, PostResponse } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Divider, FormLabel, Grid } from "@mui/material";
import { MuiChipsInput } from "mui-chips-input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import ImageUpload from "./ImageUpload";

const publishComboBox = [
  {
    text: "Xuất bản",
    value: "true",
  },
  {
    text: "Chưa xuất bản",
    value: "false",
  },
];

type PostUpsertFormProps = {
  post: PostResponse;
};

export const PostUpsertForm = ({ post }: PostUpsertFormProps) => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const rteRef = useRef<RichTextEditorRef>(null);
  const { control, getValues, setValue, handleSubmit } = useForm<PostRequest>({
    defaultValues: post,
    resolver: zodResolver(postRequestSchema),
  });
  const [chips, setChips] = useState<string[]>(post.tags);
  const [image, setImage] = useState<File>();
  const [isImageChanged, setIsImageChanged] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChipChange = (newChips: string[]) => {
    if (chips.includes(newChips[newChips.length - 1])) {
      return;
    }
    setChips(() => newChips);
  };

  const handleImageUpload = (newImage: File) => {
    setIsImageChanged(true);
    setImage(newImage);
  };
  const onSubmit = async (data: PostRequest) => {
    setIsLoading(true);
    const request: PostRequest = {
      ...data,
      content: rteRef.current?.content ?? "",
      image: image,
      tags: chips,
      isImageEdited: isImageChanged,
    };
    const formData = convertObjectToFormData(request);
    const action = post.id === EMPTY_UUID ? postApi : putApi;
    const method = postApi === postApi ? "Thêm mới" : "Cập nhật";
    const response = await action(API_URL.post, formData);
    console.log(response);
    if (response.success) {
      enqueueSnackbar(method + " bài viết thành công", {
        variant: "success",
      });
      router.push("/dashboard/posts");
    } else {
      enqueueSnackbar("Lỗi xảy ra: " + response.message, {
        variant: "error",
      });
    }
    setIsLoading(false);
  };

  const handleGenerateSlug = () => {
    const title = getValues("title");
    if (!title) return;
    // Remove special characters and replace spaces with hyphens
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");

    // Remove consecutive hyphens
    const completeSlug = slug.replace(/-{2,}/g, "-");
    setValue("slug", completeSlug);
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

    getImage(post.imageUrl)
      .then(setImage)
      .catch((err) => console.error("Image processing error:", err));
  }, [post.imageUrl]);
  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Grid container spacing={2} alignItems="center">
        <Grid size={{ xs: 12, md: 12 }}>
          <FormLabel required htmlFor="title">
            Tiêu đề
          </FormLabel>
          <ControlledTextField
            control={control}
            name="title"
            required
            fullWidth
            size="small"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 12 }}>
          <FormLabel required htmlFor="slug">
            Slug
          </FormLabel>
          <Button
            variant="text"
            color="primary"
            size="small"
            sx={{ ml: 1 }}
            onClick={handleGenerateSlug}
          >
            Tạo slug
          </Button>
          <ControlledTextField
            control={control}
            name="slug"
            required
            fullWidth
            size="small"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FormLabel htmlFor="tags">Thẻ</FormLabel>
          <MuiChipsInput
            name="tags"
            fullWidth
            value={chips}
            onChange={handleChipChange}
            placeholder="Nhập thẻ và nhấn enter"
            size="small"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FormLabel htmlFor="isPublished">Trạng thái</FormLabel>
          <ControlledComboBox
            items={publishComboBox}
            control={control}
            name="isPublished"
            size="small"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 12 }}>
          <FormLabel htmlFor="image" required>
            Ảnh bìa
          </FormLabel>
          <ImageUpload onUpload={handleImageUpload} image={image} />
        </Grid>
        <Grid size={{ xs: 12, md: 12 }}>
          <FormLabel htmlFor="content">Nội dung</FormLabel>
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
          {isLoading
            ? "Đang xử lý..."
            : post.id === EMPTY_UUID
            ? "Thêm mới"
            : "Cập nhật"}
        </Button>
      </Box>
    </form>
  );
};
