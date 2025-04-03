import { StockAlert } from "@/types";
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
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
          <ListItemAvatar>
            <Image
              src={alert.productImage}
              alt={alert.productName}
              width={100}
              height={100}
              style={{ objectFit: "contain" }}
            />
          </ListItemAvatar>
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
