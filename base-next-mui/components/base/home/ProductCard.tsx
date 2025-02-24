import { ProductResponse } from '@/types';
import { Button, Card, CardActions, CardContent, CardMedia, Typography } from '@mui/material';

interface ProductCardProps {
  product: ProductResponse;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        image={product.imageUrls[0]}
        title={product.name}
        sx={{
          height: 140,
        }}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {product.name}
        </Typography>
        {/* <Typography variant="body2" color="text.secondary">
          {product.description}
        </Typography> */}
        <Typography variant="h6" color="primary">
          {product.price.toLocaleString()}đ
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Add to cart</Button>
      </CardActions>
    </Card>
  );
}
