import Image from "next/image";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { formatNumberWithSeperator } from "@/lib/utils";
import Link from "next/link";
import { Divider } from "@mui/material";
import { Group, Stack, Text } from "@mantine/core";
import { IMAGE_ASPECT_RATIO } from "@/constant/imageAspectRatio";

type ProductSearch = {
  id: string;
  name: string;
  image: string;
  price: number;
  brand: string;
};

type ProductSearchListProps = {
  products: ProductSearch[];
  isDrawer?: boolean;
  onClick?: () => void;
};

export const ProductSearchList = ({
  products,
  isDrawer = false,
  onClick,
}: ProductSearchListProps) => {
  if (products.length === 0) {
    return null;
  }
  const listContent = (
    <List>
      {products.map((product, index) => (
        <Link
          key={product.id}
          href={`/products/${product.id}`}
          onClick={onClick}
        >
          <ListItem
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              "&:hover": {
                backgroundColor: "action.hover",
              },
            }}
          >
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              width={50}
              height={50}
              style={{ objectFit: "cover" }}
            />
            <ListItemText
              primary={product.name}
              secondary={
                <>
                  <Typography
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                    {product.brand}
                  </Typography>
                  <Typography
                    component="span"
                    variant="body2"
                    color="error.main"
                    sx={{ display: "block" }}
                  >
                    {formatNumberWithSeperator(product.price)} đ
                  </Typography>
                </>
              }
            />
          </ListItem>
          {index < products.length - 1 && <Divider />}
        </Link>
      ))}
    </List>
  );
  if (isDrawer) {
    return listContent;
  }
  return (
    <Box
      component={Paper}
      sx={{
        position: "absolute",
        top: "100%",
        left: 0,
        right: 0,
        zIndex: 4000,
        maxHeight: "400px",
        width: "100%",
        overflowY: "auto",
        border: "1px solid #ccc",
        boxShadow: 3,
      }}
    >
      {/* {listContent} */}
      {products.map((product) => (
        <BaseProductSearchItem
          key={product.id}
          product={product}
          onClick={onClick}
        />
      ))}
    </Box>
  );
};

const BaseProductSearchItem = ({
  product,
  onClick,
}: {
  product: ProductSearch;
  onClick?: () => void;
}) => {
  return (
    <Link key={product.id} href={`/products/${product.id}`} onClick={onClick}>
      <Group gap={8} p={4}>
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          width={50}
          height={50}
          style={{ objectFit: "fill", aspectRatio: IMAGE_ASPECT_RATIO.PRODUCT }}
        />
        <Stack gap={0}>
          <Text c="dark">{product.name}</Text>
          <Text c="dark" size="sm">
            {product.brand}
          </Text>
          <Text c="red">{formatNumberWithSeperator(product.price)} đ</Text>
        </Stack>
      </Group>
    </Link>
  );
};
