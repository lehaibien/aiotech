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

type ProductSearch = {
  id: string;
  name: string;
  image: string;
  price: number;
  brand: string;
};

interface ProductSearchListProps {
  products: ProductSearch[];
}

export default function ProductSearchList({
  products,
}: ProductSearchListProps) {
  if (products.length === 0) {
    return null;
  }
  return (
    <Box
      component={Paper}
      sx={{
        position: "absolute",
        top: "100%",
        left: 0,
        right: 0,
        zIndex: 1,
        maxHeight: "400px",
        width: "100%",
        overflowY: "auto",
        border: "1px solid #ccc",
        boxShadow: 3,
      }}
    >
      <List>
        {products.map((product, index) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            onClick={(event) => {
              event.stopPropagation();
              event.preventDefault();
            }}
          >
            <ListItem
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                width={50}
                height={50}
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
    </Box>
  );
}
