import { API_URL } from "@/constant/apiUrl";
import { useUserId } from "@/hooks/useUserId";
import { postApi } from "@/lib/apiClient";
import { ReviewRequest, UUID } from "@/types";
import {
  Button,
  Group,
  Rating,
  Stack,
  Text,
  Textarea,
  Title
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useState } from "react";

type NewReview = {
  rating: number;
  comment: string;
};

type WriteReviewSectionProps = {
  productId: UUID;
};

export const WriteReviewSection = ({
  productId,
}: WriteReviewSectionProps) => {
  const userId = useUserId();
  const [newReview, setNewReview] = useState<NewReview>({
    rating: 0,
    comment: "",
  });
  const handleSubmitReview = async () => {
    if (newReview.rating === 0 || newReview.comment === "") {
      return;
    }
    if (userId) {
      const request: ReviewRequest = {
        productID: productId,
        userId: userId,
        rating: newReview.rating,
        comment: newReview.comment,
      };
      const response = await postApi(API_URL.review, request);
      if (response.success) {
        notifications.show({
          title: "Đánh giá thành công",
          message: "Cảm ơn bạn đã đánh giá sản phẩm của chúng tôi.",
          color: "green",
        });
      } else {
        notifications.show({
          title: "Đánh giá không thành công",
          message: response.message,
          color: "red",
        })
      }
      setNewReview({ rating: 0, comment: "" });
    } else {
      notifications.show({
        title: "Đánh giá không thành công",
        message: "Vui lòng đăng nhập để đánh giá sản phẩm.",
        color: "red",
      })
    }
  };
  return (
    <Stack>
      <Title order={6}>Viết đánh giá của bạn</Title>
      <Group>
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
      }} variant="filled" onClick={handleSubmitReview}>
        Gửi đánh giá
      </Button>
    </Stack>
  );
};
