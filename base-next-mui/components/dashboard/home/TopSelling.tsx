import { List, ListItem, ListItemText, ListItemAvatar, Avatar } from '@mui/material';

const mockProducts = [
  { id: '1', name: 'Gaming Mouse', salesCount: 1245, imageUrl: '/placeholder.svg?height=40&width=40' },
  { id: '2', name: 'Mechanical Keyboard', salesCount: 1100, imageUrl: '/placeholder.svg?height=40&width=40' },
  { id: '3', name: 'Gaming Headset', salesCount: 950, imageUrl: '/placeholder.svg?height=40&width=40' },
  { id: '4', name: '4K Monitor', salesCount: 820, imageUrl: '/placeholder.svg?height=40&width=40' },
  { id: '5', name: 'Gaming Chair', salesCount: 780, imageUrl: '/placeholder.svg?height=40&width=40' },
];

export default function TopSelling() {
  return (
    <List>
      {mockProducts.map((product) => (
        <ListItem key={product.id}>
          <ListItemAvatar>
            <Avatar alt={product.name} src={product.imageUrl} />
          </ListItemAvatar>
          <ListItemText
            primary={product.name}
            secondary={`Sales: ${product.salesCount}`}
          />
        </ListItem>
      ))}
    </List>
  );
}

