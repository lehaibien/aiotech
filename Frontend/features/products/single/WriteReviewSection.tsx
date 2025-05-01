import {
  Button,
  Group,
  Rating,
  Stack,
  Text,
  Textarea,
  Title
} from "@mantine/core";
import { useState } from "react";

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
    comment: "",
  });
  const handleSubmit = () => {
    if (newReview.rating === 0 || newReview.comment === "") {
      return;
    }
    handleSubmitReview(newReview);
  };
  return (
    <Stack gap={8}>
      <Title order={6}>Viết đánh giá của bạn</Title>
      <Group gap={4}>
        <Rating
          value={newReview.rating}
          onChange={(value) =>
            setNewReview({ ...newReview, rating: value })
          }
          size="lg"
        />
        <Text size="md" c="gray">
          {newReview.rating > 0 ? `${newReview.rating}/5 sao` : "Chọn đánh giá"}
        </Text>
      </Group>
      <Textarea
        placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
        rows={4}
        value={newReview.comment}
        onChange={(e) =>
          setNewReview({ ...newReview, comment: e.target.value })
        }
      />
      <Button w={{
        base: '100%',
        md: '30%'
      }} variant="filled" onClick={handleSubmit}>
        Gửi đánh giá
      </Button>
    </Stack>
  );
};
