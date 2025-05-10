import { ReviewResponse } from "@/types";
import { Rating } from "@mantine/core";

export const ReviewRatingRenderer = (record: ReviewResponse) => {
  return <Rating value={record.rating} readOnly size='sm'/>;
};
