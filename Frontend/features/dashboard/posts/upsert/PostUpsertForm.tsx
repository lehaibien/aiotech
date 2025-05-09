"use client";

import { MantineImageUploader } from "@/components/core/MantineImageUploader";
import { ControlledPillInput } from "@/components/form/ControlledPillInput";
import { ControlledRichTextEditor } from "@/components/form/ControlledRichTextEditor";
import { ControlledSelect } from "@/components/form/ControlledSelect";
import { ControlledTextInput } from "@/components/form/ControlledTextField";
import { API_URL } from "@/constant/apiUrl";
import { EMPTY_UUID } from "@/constant/common";
import { IMAGE_ASPECT_RATIO } from "@/constant/imageAspectRatio";
import { postApi, putApi } from "@/lib/apiClient";
import { convertObjectToFormData } from "@/lib/utils";
import { postRequestSchema } from "@/schemas/postSchema";
import { PostRequest, PostUpdateResponse } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Grid, Group, Input } from "@mantine/core";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

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
  post: PostUpdateResponse;
};

export const PostUpsertForm = ({ post }: PostUpsertFormProps) => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { control, getValues, setValue, handleSubmit } = useForm<PostRequest>({
    defaultValues: post,
    resolver: zodResolver(postRequestSchema),
  });
  const [image, setImage] = useState<File>();
  const [isImageChanged, setIsImageChanged] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: PostRequest) => {
    setIsLoading(true);
    const request: PostRequest = {
      ...data,
      image: image,
      isImageEdited: isImageChanged,
    };
    const formData = convertObjectToFormData(request);
    const action = post.id === EMPTY_UUID ? postApi : putApi;
    const method = postApi === postApi ? "Thêm mới" : "Cập nhật";
    const response = await action(API_URL.post, formData);
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
    if (!title) {
      return;
    }

    // Normalize Vietnamese characters
    const normalizedTitle = title
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    const slug = normalizedTitle
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-{2,}/g, "-");

    setValue("slug", slug);
  };

  useEffect(() => {
    const getImage = async (url: string) => {
      if (!url) return undefined;

      try {
        const response = await fetch(url, {
          mode: "cors", // Enable CORS
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

    getImage(post.imageUrl)
      .then(setImage)
      .catch((err) => console.error("Image processing error:", err));
  }, [post.imageUrl]);
  return (
    <Grid align="center" component="form" onSubmit={handleSubmit(onSubmit)}>
      <Grid.Col span={{ xs: 12, md: 12 }}>
        <ControlledTextInput
          control={control}
          name="title"
          required
          size="sm"
          label="Tiêu đề"
        />
      </Grid.Col>
      <Grid.Col span={{ xs: 12, md: 12 }} pos="relative">
        <Button
          id="slug"
          name="slug"
          size="compact-xs"
          onClick={handleGenerateSlug}
          pos="absolute"
          right={10}
        >
          Tạo slug
        </Button>
        <ControlledTextInput
          control={control}
          name="slug"
          required
          size="sm"
          label="Tên rút gọn (không dấu)"
        />
      </Grid.Col>
      <Grid.Col span={{ xs: 12, md: 6 }}>
        <ControlledPillInput control={control} name="tags" label="Thẻ" />
      </Grid.Col>
      <Grid.Col span={{ xs: 12, md: 6 }}>
        <ControlledSelect
          control={control}
          name="isPublished"
          label="Trạng thái"
          options={publishComboBox}
          required
        />
      </Grid.Col>
      <Grid.Col span={{ xs: 12, md: 12 }}>
        <Input.Label required>Hình ảnh</Input.Label>
        <MantineImageUploader
          onDrop={(files) => {
            setImage(files[0]);
            setIsImageChanged(true);
          }}
        />
        <Image
          src={image ? URL.createObjectURL(image) : "/image-not-found.jpg"}
          width={1200}
          height={800}
          alt="hero banner"
          style={{
            marginTop: 8,
            objectFit: "fill",
            maxWidth: "100%",
            maxHeight: "100%",
            aspectRatio: IMAGE_ASPECT_RATIO.BLOG,
          }}
        />
      </Grid.Col>
      <Grid.Col span={{ xs: 12, md: 12 }}>
        <ControlledRichTextEditor
          control={control}
          name="content"
          label="Nội dung"
          required
        />
      </Grid.Col>
      <Grid.Col
        span={12}
        style={{
          position: 'sticky',
          bottom: 0,
          left: 0,
          zIndex: 1000,
        }}
      >
        <Group justify="flex-end">
          <Button
            component={Link}
            href="/dashboard/posts"
            type="button"
            disabled={isLoading}
          >
            Hủy
          </Button>
          <Button type="submit" disabled={isLoading} loading={isLoading}>
            {post.id === EMPTY_UUID ? "Thêm mới" : "Cập nhật"}
          </Button>
        </Group>
      </Grid.Col>
      {/* Add bottom padding to prevent content from being hidden behind fixed buttons */}
      <Grid.Col span={12} mb={60} />
    </Grid>
  );
};
