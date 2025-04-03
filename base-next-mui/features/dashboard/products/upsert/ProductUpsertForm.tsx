"use client";

import ControlledComboBox from "@/components/core/ControlledComboBox";
import RichTextEditor, {
  RichTextEditorRef,
} from "@/components/core/RichTextEditor";
import { API_URL } from "@/constant/apiUrl";
import { EMPTY_UUID } from "@/constant/common";
import { postApi, putApi } from "@/lib/apiClient";
import { convertObjectToFormData } from "@/lib/utils";
import { ComboBoxItem } from "@/types";
import { type ProductRequest, ProductRequestSchema } from "@/types/product";
import { zodResolver } from "@hookform/resolvers/zod";
import { Grid2 as Grid, Paper, Typography } from "@mui/material";
import { MuiChipsInput } from "mui-chips-input";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Control,
  FieldValues,
  TextFieldElement,
  useForm,
} from "react-hook-form-mui";
import ImageUpload from "./ImageUpload";
import { FormActions } from "./ProductFormActions";
import { SectionTitle } from "./ProductSectionTitle";

type ProductUpsertFormProps = {
  brands: ComboBoxItem[];
  categories: ComboBoxItem[];
  defaultImages?: string[];
  product: ProductRequest;
};

const featuredOptions = [
  { value: "true", text: "Có" },
  { value: "false", text: "Không" },
];

export function ProductUpsertForm({
  brands,
  categories,
  product,
  defaultImages = [],
}: ProductUpsertFormProps) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const rteRef = useRef<RichTextEditorRef>(null);

  const { control, handleSubmit } = useForm<ProductRequest>({
    defaultValues: {
      ...product,
      discountPrice: product.discountPrice ?? undefined,
    },
    resolver: zodResolver(ProductRequestSchema),
  });

  const [chips, setChips] = useState<string[]>(product.tags ?? []);
  const [images, setImages] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleChipChange = useCallback((newChips: string[]) => {
    setChips(newChips);
  }, []);

  const handleImageUpload = useCallback((newImages: File[]) => {
    setImages((prev) => [...prev, ...newImages]);
  }, []);

  const handleSubmitSuccess = useCallback(
    (message: string) => {
      enqueueSnackbar(message, { variant: "success" });
      router.push("/dashboard/products");
    },
    [enqueueSnackbar, router]
  );

  const handleSubmitError = useCallback(
    (message: string) => {
      enqueueSnackbar(message, { variant: "error" });
    },
    [enqueueSnackbar]
  );

  const onSubmit = async (data: ProductRequest) => {
    setIsLoading(true);
    try {
      const request: ProductRequest = {
        ...data,
        discountPrice: data.discountPrice || undefined,
        description: rteRef.current?.content ?? "",
        tags: chips,
        images,
      };

      const formData = convertObjectToFormData(request);
      const action = product.id === EMPTY_UUID ? postApi : putApi;
      const response = await action(API_URL.product, formData);

      if (response.success) {
        handleSubmitSuccess(
          product.id === EMPTY_UUID
            ? "Thêm mới sản phẩm thành công"
            : "Cập nhật sản phẩm thành công"
        );
      } else {
        handleSubmitError(
          response.message ?? "Đã xảy ra lỗi khi xử lý yêu cầu"
        );
      }
    } catch (error) {
      handleSubmitError("Đã xảy ra lỗi khi xử lý yêu cầu");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const loadDefaultImages = async () => {
      const imagePromises = defaultImages.map(async (url) => {
        const response = await fetch(url);
        const blob = await response.blob();
        return new File([blob], url.substring(url.lastIndexOf("/") + 1));
      });
      const loadedImages = await Promise.all(imagePromises);
      setImages(loadedImages);
    };

    loadDefaultImages();
  }, [defaultImages]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      style={{ position: "relative" }}
    >
      <Grid container spacing={4}>
        {/* Product Information Section */}
        <Grid size={{ sm: 12, md: 8 }}>
          <Paper elevation={1} sx={{ p: 2 }}>
            <SectionTitle>Thông tin chung</SectionTitle>

            <Grid container spacing={2}>
              <Grid size={12}>
                <TextFieldElement
                  control={control}
                  name="sku"
                  label="Mã sản phẩm"
                  required
                  fullWidth
                  size="small"
                />
              </Grid>
              <Grid size={12}>
                <TextFieldElement
                  control={control}
                  name="name"
                  label="Tên sản phẩm"
                  required
                  fullWidth
                  size="small"
                />
              </Grid>
              <Grid size={6}>
                <TextFieldElement
                  control={control}
                  name="price"
                  label="Giá gốc"
                  type="number"
                  required
                  fullWidth
                  size="small"
                />
              </Grid>
              <Grid size={6}>
                <TextFieldElement
                  control={control}
                  name="discountPrice"
                  label="Giá khuyến mãi"
                  type="number"
                  fullWidth
                  size="small"
                  InputProps={{
                    inputProps: { min: 0, max: Number.MAX_SAFE_INTEGER },
                  }}
                  onChange={(e) => {
                    const value = e.target.value;
                    return value === "" ? null : Number(value);
                  }}
                />
              </Grid>
              <Grid size={6}>
                <TextFieldElement
                  control={control}
                  name="stock"
                  label="Số lượng tồn kho"
                  type="number"
                  required
                  fullWidth
                  size="small"
                />
              </Grid>

              <Grid size={6}>
                {/* <AutocompleteElement
                  control={control}
                  name="isFeatured"
                  label="Nổi bật"
                  options={featuredOptions}
                  autocompleteProps={{
                    disableClearable: true,
                    getOptionLabel: (option) => option.text,
                    size: "small",
                  }}
                  transform={{
                    input: (value) => ({
                      value: String(value),
                      text: value ? "Có" : "Không",
                    }),
                    output: (_, value) => value?.value === "true",
                  }}
                /> */}
                <ControlledComboBox
                  control={control as unknown as Control<FieldValues>}
                  name="isFeatured"
                  label="Nổi bật"
                  items={featuredOptions}
                  required
                />
              </Grid>

              <Grid size={6}>
                <ControlledComboBox
                  control={control as unknown as Control<FieldValues>}
                  name="brandId"
                  label="Thương hiệu"
                  items={brands}
                  required
                />
              </Grid>

              <Grid size={6}>
                <ControlledComboBox
                  control={control as unknown as Control<FieldValues>}
                  name="categoryId"
                  label="Danh mục"
                  items={categories}
                  required
                />
              </Grid>

              <Grid size={12}>
                <MuiChipsInput
                  fullWidth
                  size="small"
                  value={chips}
                  onChange={handleChipChange}
                  label="Thẻ"
                  placeholder="Nhập và nhấn Enter để thêm thẻ"
                />
              </Grid>

              <Grid size={12}>
                <Typography variant="body1" gutterBottom sx={{ mt: 1 }}>
                  Mô tả
                </Typography>
                <RichTextEditor
                  ref={rteRef}
                  defaultContent={product.description ?? ""}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Product Images Section */}
        <Grid size={{ sm: 12, md: 4 }}>
          <Paper elevation={1} sx={{ p: 2 }}>
            <SectionTitle>Ảnh sản phẩm</SectionTitle>
            <ImageUpload onUpload={handleImageUpload} images={images} />
          </Paper>
        </Grid>
      </Grid>

      {/* Form Actions */}
      <FormActions isLoading={isLoading} isNew={product.id === EMPTY_UUID} />
    </form>
  );
}
