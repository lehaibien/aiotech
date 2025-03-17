import { StockAlert } from "@/types";
import { List, ListItem, ListItemText, Typography } from "@mui/material";
import Image from "next/image";

type StockAlertSectionProps = {
  data: StockAlert[];
};

export function StockAlertSection({ data }: StockAlertSectionProps) {
  return (
    <List
      sx={{
        height: "100%",
      }}
    >
      {data.map((alert) => (
        <ListItem key={alert.productId}>
          <Image
            src={alert.productImage}
            alt={alert.productName}
            width={50}
            height={50}
          />
          <ListItemText
            primary={alert.productName}
            secondary={
              <Typography component="span" variant="body2" color="error">
                Số lượng còn lại: {alert.stock}
              </Typography>
            }
          />
        </ListItem>
      ))}
    </List>
  );
}
