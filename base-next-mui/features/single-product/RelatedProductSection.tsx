import { generateUUID } from '@/lib/utils';
import { ProductDetailResponse } from '@/types/product';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid2 as Grid,
  Rating,
  Typography,
} from '@mui/material';
import Link from 'next/link';

interface RelatedProductsProps {
  category: string;
  currentProductId: string;
}

// This is a mock function. Replace it with your actual data fetching logic.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const fetchRelatedProducts = async (
  category: string,
  currentProductId: string
): Promise<ProductDetailResponse[]> => {
  // Implement your data fetching logic here
  void category;
  void currentProductId;
  /*
id: UUID;
  sku: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  brand: string;
  category: string;
  tagNames: string[];
  imageUrls: string[];
  rating: number;
  isFeatured: boolean;
  */
  return [
    {
      id: generateUUID(),
      sku: '55A1DF',
      name: 'Product 1',
      description: 'Description of Product 1',
      price: 99.99,
      stock: 10,
      brand: 'Brand 1',
      category: 'Category 1',
      tags: ['tag1', 'tag2'],
      imageUrls: ['/ecommerce.png'],
      rating: 4.5,
      isFeatured: false,
    },
    {
      id: generateUUID(),
      sku: '55A1DF',
      name: 'Product 2',
      brand: 'Brand 2',
      category: 'Category 2',
      description: 'Description of Product 2',
      isFeatured: false,
      stock: 10,
      tags: ['tag1', 'tag2'],
      rating: 4.5,
      price: 99.99,
      imageUrls: ['/ecommerce.png'],
    },
    {
      id: generateUUID(),
      sku: '55A1DF',
      name: 'Product 3',
      brand: 'Brand 3',
      category: 'Category 3',
      description: 'Description of Product 3',
      isFeatured: false,
      stock: 10,
      tags: ['tag1', 'tag2'],
      rating: 4.5,
      price: 99.99,
      imageUrls: ['/ecommerce.png'],
    },
  ];
};

export default async function RelatedProducts({
  category,
  currentProductId,
}: RelatedProductsProps) {
  const data = await fetchRelatedProducts(category, currentProductId);
  return (
    <Box mt={4}>
      <Typography variant='h5' gutterBottom fontWeight='bold'>
        Sản phẩm liên quan
      </Typography>
      <Grid container spacing={3}>
        {data.map((product) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={product.id}>
            <Link href={`/products/${product.id}`} passHref>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <CardMedia
                  component='img'
                  height='120'
                  image={product.imageUrls[0]}
                  alt={product.name}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography
                    gutterBottom
                    variant='subtitle1'
                    noWrap
                    sx={{
                      fontSize: '1.1rem',
                      fontWeight: 600,
                    }}
                  >
                    {product.name}
                  </Typography>
                  <Box display='flex' alignItems='center' mb={1}>
                    <Rating value={product.rating} readOnly size='small' />
                    <Typography variant='body2' ml={1}>
                      ({product.rating.toFixed(1)})
                    </Typography>
                  </Box>
                  <Typography variant='body1' color='error.main'>
                    ${product.price.toFixed(2)}
                  </Typography>
                </CardContent>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
