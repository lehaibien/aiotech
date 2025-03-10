'use client'

import { List, ListItem, ListItemText, Typography } from '@mui/material';

const mockStockAlerts = [
  { id: '1', productName: 'Gaming Mouse', currentStock: 5, minStockLevel: 10 },
  { id: '2', productName: 'Mechanical Keyboard', currentStock: 3, minStockLevel: 8 },
  { id: '3', productName: 'Gaming Headset', currentStock: 2, minStockLevel: 5 },
  { id: '4', productName: '4K Monitor', currentStock: 1, minStockLevel: 3 },
  { id: '5', productName: 'Gaming Chair', currentStock: 4, minStockLevel: 6 },
];

export function StockAlert() {
  return (
    <List>
      {mockStockAlerts.map((alert) => (
        <ListItem key={alert.id}>
          <ListItemText
            primary={alert.productName}
            secondary={
              <Typography component="span" variant="body2" color="error">
                Số lượng còn lại: {alert.currentStock} (Tối thiểu: {alert.minStockLevel})
              </Typography>
            }
          />
        </ListItem>
      ))}
    </List>
  );
}

