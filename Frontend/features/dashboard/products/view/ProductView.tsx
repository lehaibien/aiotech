import { ProductDetailResponse } from "@/types";
import {
  Box,
  Button,
  Divider,
  Grid2 as Grid,
  Paper,
  Typography,
} from "@mui/material";
import Link from "next/link";
import ProductImageView from "./ProductImageView";
import { Chip, Stack } from "@mui/material";
import { CheckCircle, Warning } from "@mui/icons-material";

type ProductViewProps = {
  product: ProductDetailResponse;
};

export default function ProductView({ product }: ProductViewProps) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Box sx={{ 
        borderBottom: 1,
        borderColor: 'divider',
      }}>
        <Typography variant="h3" component="h1" sx={{ 
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          {product.name}
          <Chip
            label={product.isFeatured ? "Nổi bật" : "Thường"}
            color={product.isFeatured ? "primary" : "default"}
            size="small"
          />
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ 
              mb: 3,
              fontWeight: 600,
              color: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              Thông tin chung
            </Typography>
            
            <Stack spacing={2} divider={<Divider flexItem />}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">SKU:</Typography>
                <Typography variant="body1">{product.sku}</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">Giá niêm yết:</Typography>
                <Typography variant="body1">
                  {product.price.toLocaleString()} đ
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">Giá khuyến mãi:</Typography>
                <Typography variant="body1" color="success.main">
                  {product.discountPrice ? 
                    `${product.discountPrice.toLocaleString()} đ` : "-"}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">Tồn kho:</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {product.stock > 0 ? (
                    <>
                      <CheckCircle color="success" fontSize="small" />
                      <Typography variant="body1">{product.stock}</Typography>
                    </>
                  ) : (
                    <>
                      <Warning color="error" fontSize="small" />
                      <Typography variant="body1" color="error">Hết hàng</Typography>
                    </>
                  )}
                </Box>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">Thương hiệu:</Typography>
                <Typography variant="body1">{product.brand}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Danh mục:
                  </Typography>
                <Typography variant="body1">{product.category}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">Thẻ:</Typography>
                <Typography variant="body1">{product.tags.join(', ')}</Typography>
              </Box>
              <Stack>
                <Typography variant="body2" color="text.secondary">
                  Mô tả:
                </Typography>
                <div dangerouslySetInnerHTML={{ __html: product.description }} />
              </Stack>
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper elevation={3} className="p-4 mb-4">
            <Typography variant="h6" className="mb-4">
              Ảnh sản phẩm
            </Typography>
            <ProductImageView images={product.imageUrls} />
          </Paper>
        </Grid>
      </Grid>

        <Box sx={{ 
          display: "flex", 
          justifyContent: "flex-end", 
          gap: 2,
          '& .MuiButton-root': { 
            minWidth: 120,
            textTransform: 'none',
            fontWeight: 600 
          }
        }}>
          <Button
            variant="contained"
            color="inherit"
            LinkComponent={Link}
            href="/dashboard/products"
          >
            Quay lại
          </Button>
          <Button
            variant="contained"
            color="primary"
            LinkComponent={Link}
            href={`/dashboard/products/upsert?id=${product.id}`}
          >
            Chỉnh sửa
          </Button>
        </Box>
    </Box>
  );
}
