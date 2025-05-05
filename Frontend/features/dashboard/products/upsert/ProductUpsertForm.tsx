"use client";

import { MantineImageUploader } from "@/components/core/MantineImageUploader";
import { ControlledCombobox } from "@/components/form/ControlledMantineCombobox";
import { ControlledPillInput } from "@/components/form/ControlledPillInput";
import { ControlledRichTextEditor } from "@/components/form/ControlledRichTextEditor";
import { ControlledSelect } from "@/components/form/ControlledSelect";
import { ControlledTextInput } from "@/components/form/ControlledTextField";
import { API_URL } from "@/constant/apiUrl";
import { EMPTY_UUID } from "@/constant/common";
import { IMAGE_ASPECT_RATIO } from "@/constant/imageAspectRatio";
import { postApi, putApi } from "@/lib/apiClient";
import { convertObjectToFormData } from "@/lib/utils";
import { productRequestSchema } from "@/schemas/productSchema";
import { ComboBoxItem } from "@/types";
import { ProductRequest } from "@/types/product";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Grid, Group, Input, Stack } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ImageUpload } from "./ImageUpload";

type ProductUpsertFormProps = {
  brands: ComboBoxItem[];
  categories: ComboBoxItem[];
  defaultImages?: string[];
  defaultThumbnail?: string;
  product: ProductRequest;
};

const featuredOptions = [
  { value: "true", text: "Có" },
  { value: "false", text: "Không" },
];

export const ProductUpsertForm = ({
  brands,
  categories,
  product,
  defaultImages = [],
  defaultThumbnail,
}: ProductUpsertFormProps) => {
  const router = useRouter();
  const { control, handleSubmit } = useForm<ProductRequest>({
    defaultValues: {
      ...product,
      discountPrice: product.discountPrice ?? 0,
    },
    resolver: zodResolver(productRequestSchema),
  });

  const [thumbnail, setThumbnail] = useState<File | undefined>(undefined);
  const [images, setImages] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteImage = useCallback((index: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== index));
  }, []);

  const onSubmit = async (data: ProductRequest) => {
    setIsLoading(true);
    try {
      const request: ProductRequest = {
        ...data,
        discountPrice: data.discountPrice || undefined,
        thumbnail,
        images,
      };

      const formData = convertObjectToFormData(request);
      const action = product.id === EMPTY_UUID ? postApi : putApi;
      const response = await action(API_URL.product, formData);

      if (response.success) {
        const message =
          product.id === EMPTY_UUID
            ? "Thêm mới sản phẩm thành công"
            : "Cập nhật sản phẩm thành công";
        notifications.show({
          title: message,
          message: "Chuyển hướng về danh sách sản phẩm",
          color: "green",
        });
        router.push("/dashboard/products");
      } else {
        notifications.show({
          title: "Đã xảy ra lỗi khi xử lý yêu cầu",
          message: response.message ?? "Lỗi không xác định",
          color: "red",
        });
      }
    } catch (error) {
      notifications.show({
        title: "Đã xảy ra lỗi khi xử lý yêu cầu",
        message: (error as Error).message,
        color: "red",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const getImages = async (urls: string[]) => {
      if (urls.length == 0) return [];

      try {
        const responses = await Promise.all(
          urls.map(async (url) => {
            const response = await fetch(url, {
              mode: "cors",
            });
            if (!response.ok) {
              throw new Error("Failed to fetch image");
            }

            const blob = await response.blob();
            return new File([blob], url.substring(url.lastIndexOf("/") + 1), {
              type: blob.type,
            });
          })
        );

        const files: File[] = responses.filter(
          (file) => file !== undefined
        ) as File[];
        return files;
      } catch (err) {
        console.error("Image fetch error:", err);
        return [];
      }
    };

    getImages(defaultImages)
      .then(setImages)
      .catch((err) => console.error("Image processing error:", err));

    getImages([defaultThumbnail ?? ""])
      .then((files) => setThumbnail(files[0]))
      .catch((err) => console.error("Image processing error:", err));
  }, [defaultImages, defaultThumbnail]);
  return (
    <Grid component="form" onSubmit={handleSubmit(onSubmit)}>
      <Grid.Col span={{ sm: 12, lg: 9 }}>
        <Grid>
          <Grid.Col span={6}>
            <ControlledTextInput
              control={control}
              name="sku"
              required
              size="sm"
              label="Mã sản phẩm"
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <ControlledTextInput
              control={control}
              name="name"
              required
              size="sm"
              label="Tên sản phẩm"
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <ControlledTextInput
              control={control}
              name="costPrice"
              type="number"
              required
              size="sm"
              label="Giá nhập"
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <ControlledTextInput
              control={control}
              name="price"
              type="number"
              required
              size="sm"
              label="Giá bán gốc"
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <ControlledTextInput
              control={control}
              name="discountPrice"
              type="number"
              size="sm"
              label="Giá khuyến mãi"
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <ControlledTextInput
              control={control}
              name="stock"
              type="number"
              required
              size="sm"
              label="Số lượng tồn kho"
            />
          </Grid.Col>

          <Grid.Col span={6}>
            <ControlledCombobox
              control={control}
              name="brandId"
              options={brands}
              required
              size="sm"
              label="Thương hiệu"
            />
          </Grid.Col>

          <Grid.Col span={6}>
            <ControlledCombobox
              control={control}
              name="categoryId"
              options={categories}
              required
              size="sm"
              label="Danh mục"
            />
          </Grid.Col>

          <Grid.Col span={6}>
            <ControlledSelect
              control={control}
              name="isFeatured"
              options={featuredOptions}
              required
              size="sm"
              label="Nổi bật"
            />
          </Grid.Col>

          <Grid.Col span={6}>
            <ControlledPillInput
              control={control}
              name="tags"
              size="sm"
              label="Thẻ"
              placeholder="Nhập thẻ"
            />
          </Grid.Col>

          <Grid.Col span={12}>
            <ControlledRichTextEditor
              control={control}
              name="description"
              required
              label="Mô tả"
              mih={400}
            />
          </Grid.Col>
        </Grid>
      </Grid.Col>

      <Grid.Col span={{ sm: 12, lg: 3 }}>
        <Stack gap="xs">
          <Input.Label required>Ảnh đại diện</Input.Label>
          <MantineImageUploader
            onDrop={(files) => {
              setThumbnail(files[0]);
              // setIsImageChanged(true);
            }}
          />
          <Image
            src={
              thumbnail
                ? URL.createObjectURL(thumbnail)
                : "/image-not-found.jpg"
            }
            width={300}
            height={300}
            alt="Thumbnail"
            style={{
              marginTop: 8,
              objectFit: "fill",
              width: "100%",
              height: "100%",
              backgroundColor: "white",
              aspectRatio: IMAGE_ASPECT_RATIO.PRODUCT,
            }}
          />
          <Input.Label required>Hình ảnh chi tiết</Input.Label>
          <ImageUpload
            images={images}
            onDelete={handleDeleteImage}
            onUpload={setImages}
            onReorder={setImages}
          />
        </Stack>
      </Grid.Col>

      <Group
        w="100%"
        justify="flex-end"
        style={{
          position: "sticky",
          bottom: 0,
          right: 0,
          zIndex: 1000,
        }}
      >
        <Button
          component={Link}
          href="/dashboard/products"
          type="button"
          variant="outline"
          disabled={isLoading}
        >
          Hủy
        </Button>
        <Button type="submit" disabled={isLoading} loading={isLoading}>
          {product.id === EMPTY_UUID ? "Thêm mới" : "Cập nhật"}
        </Button>
      </Group>
    </Grid>
  );
};
