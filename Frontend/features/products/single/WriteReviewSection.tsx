import {
  Box,
  Button,
  Rating,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';

type NewReview = {
  rating: number;
  comment: string;
};

type WriteReviewSectionProps = {
  handleSubmitReview: (value: NewReview) => void;
};

export const WriteReviewSection = ({
  handleSubmitReview,
}: WriteReviewSectionProps) => {
  const [newReview, setNewReview] = useState<NewReview>({
    rating: 0,
    comment: '',
  });
  const handleSubmit = () => {
    if (newReview.rating === 0 || newReview.comment === '') {
      return;
    }
    handleSubmitReview(newReview);
  };
  return (
    <Stack spacing={2}>
      <Typography
        variant='h6'
        gutterBottom>
        Viết đánh giá của bạn
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Rating
          value={newReview.rating}
          onChange={(_, value) =>
            setNewReview({ ...newReview, rating: value || 0 })
          }
          size='large'
        />
        <Typography
          variant='body2'
          color='text.secondary'>
          {newReview.rating > 0 ? `${newReview.rating}/5 sao` : 'Chọn đánh giá'}
        </Typography>
      </Box>
      <TextField
        fullWidth
        multiline
        rows={4}
        placeholder='Chia sẻ trải nghiệm của bạn về sản phẩm này...'
        value={newReview.comment}
        onChange={(e) =>
          setNewReview({ ...newReview, comment: e.target.value })
        }
      />
      <Button
        variant='contained'
        color='primary'
        sx={{
          width: 'fit-content',
        }}
        onClick={handleSubmit}>
        Gửi đánh giá
      </Button>
    </Stack>
  );
};
