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
import { Box, Button, Grid2 as Grid, Paper, Typography } from "@mui/material";
import { MuiChipsInput } from "mui-chips-input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { useEffect, useRef, useState } from "react";
import {
  AutocompleteElement,
  Control,
  FieldValues,
  TextFieldElement,
  useForm,
} from "react-hook-form-mui";
import ImageUpload from "./ImageUpload";

type ProductUpsertFormProps = {
  brands: ComboBoxItem[];
  categories: ComboBoxItem[];
  defaultImages?: string[];
  product: ProductRequest;
};

function ProductUpsertForm({
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
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChipChange = (newChips: string[]) => {
    setChips(newChips);
  };

  const handleImageUpload = (newImages: File[]) => {
    setImages((prevImages) => [...prevImages, ...newImages]);
  };
  // Modify the onSubmit handler to handle null values:
  const onSubmit = async (data: ProductRequest) => {
    setIsLoading(true);
    const request: ProductRequest = {
      ...data,
      discountPrice: data.discountPrice || undefined, // Convert empty/null to undefined
      description: rteRef.current?.content ?? "",
      tags: chips,
      images: images,
    };
    const formData = convertObjectToFormData(request);
    if (product.id === EMPTY_UUID) {
      const response = await postApi(API_URL.product, formData);
      if (response.success) {
        enqueueSnackbar("Thêm mới sản phẩm thành công", {
          variant: "success",
        });
        router.push("/dashboard/products");
      } else {
        enqueueSnackbar(response.message, { variant: "error" });
      }
    } else {
      const response = await putApi(API_URL.product, formData);
      if (response.success) {
        enqueueSnackbar("Cập nhật sản phẩm thành công", {
          variant: "success",
        });
        router.push("/dashboard/products");
      } else {
        enqueueSnackbar(response.message, { variant: "error" });
      }
    }
    setIsLoading(false);
  };
  useEffect(() => {
    const imagePromises = defaultImages.map(async (url) => {
      const response = await fetch(url);
      const blob = await response.blob();
      return new File([blob], url.substring(url.lastIndexOf("/") + 1));
    });
    Promise.all(imagePromises).then((res) => {
      setImages(res);
    });
  }, [defaultImages]);
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      style={{
        position: "relative",
      }}
    >
      <Grid container spacing={4}>
        <Grid size={{ sm: 12, md: 8 }}>
          <Paper
            elevation={1}
            sx={{
              p: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                mb: 3,
                fontWeight: 600,
                color: "primary.main",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              Thông tin chung
            </Typography>
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
                <AutocompleteElement
                  control={control}
                  name="isFeatured"
                  label="Nổi bật"
                  options={[
                    { value: "true", text: "Có" },
                    { value: "false", text: "Không" },
                  ]}
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
                    output: (event, value) => value?.value === "true",
                  }}
                />
              </Grid>
              <Grid size={6}>
                {/* <AutocompleteElement
                  options={brands}
                  control={control}
                  name="brandId"
                  label="Thương hiệu"
                  autocompleteProps={{
                    size: "small",
                    autoHighlight: true,
                    noOptionsText: "Không có kết quả",
                    getOptionLabel(option: ComboBoxItem) {
                      return option.text || "";
                    },
                    isOptionEqualToValue(
                      option: ComboBoxItem,
                      newValue: ComboBoxItem
                    ) {
                      return (
                        option.value.toLowerCase() ===
                        newValue.value.toLowerCase()
                      );
                    },
                  }}
                  transform={{
                    input: (value: string) =>
                      brands.find(
                        (brand) =>
                          brand.value.toLowerCase() === value.toLowerCase()
                      ) || null,
                    output: (event, value: ComboBoxItem | null) =>
                      value?.value || "",
                  }}
                /> */}
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
                />
              </Grid>
            </Grid>
            <Typography variant="body1" gutterBottom sx={{ mt: 1 }}>
              Mô tả
            </Typography>
            <RichTextEditor
              ref={rteRef}
              defaultContent={product.description ?? ""}
            />
          </Paper>
        </Grid>

        <Grid size={{ sm: 12, md: 4 }}>
          <Paper
            elevation={1}
            sx={{
              p: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                mb: 3,
                fontWeight: 600,
                color: "primary.main",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              Ảnh sản phẩm
            </Typography>
            <ImageUpload onUpload={handleImageUpload} images={images} />
          </Paper>
        </Grid>
      </Grid>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          position: "sticky",
          bottom: 0,
          right: 0,
          zIndex: 1000,
          background: "background.paper",
          p: 2,
          gap: 1,
        }}
      >
        <Button
          LinkComponent={Link}
          href="/dashboard/products"
          type="button"
          variant="contained"
          color="inherit"
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
            : product.id === EMPTY_UUID
            ? "Thêm mới"
            : "Cập nhật"}
        </Button>
      </Box>
    </form>
  );
}

export default ProductUpsertForm;
