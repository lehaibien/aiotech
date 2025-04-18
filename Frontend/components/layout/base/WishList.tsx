import { Badge, IconButton } from '@mui/material';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';

export const WishList = () => {
  const badgeCount = 3;
  return (
    <IconButton color="inherit" sx={{ p: 1 }}>
        <Badge badgeContent={badgeCount} color="primary">
          <FavoriteBorderOutlinedIcon fontSize="small" />
        </Badge>
      </IconButton>
  );
};
