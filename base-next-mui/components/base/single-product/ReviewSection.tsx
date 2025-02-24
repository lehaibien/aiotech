"use client";

import { API_URL } from "@/constant/apiUrl";
import { getListApi, postApi } from "@/lib/apiClient";
import {
  ApiResponse,
  GetListReviewByProductIdRequest,
  ReviewProductResponse,
  ReviewRequest,
} from "@/types";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Divider,
  Rating,
  TextField,
  Typography,
} from "@mui/material";
import { UUID } from "crypto";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useSnackbar } from "notistack";
import { useCallback, useMemo, useState } from "react";
import useSWR from "swr";

type ReviewSectionProps = {
  productId: UUID;
};

export default function ReviewSection({ productId }: ReviewSectionProps) {
  const { enqueueSnackbar } = useSnackbar();
  const { data: session } = useSession();

  const user = useMemo(() => session?.user, [session]);
  const [newReview, setNewReview] = useState({ rating: 0, comment: "" });

  const reviewFetcher = useCallback(
    async ([productId, page, pageSize]: [UUID, number, number]) => {
      const request: GetListReviewByProductIdRequest = {
        productId: productId,
        pageIndex: page - 1,
        pageSize: pageSize,
        textSearch: "",
      };
      const response = await getListApi(API_URL.reviewByProduct, request);
      if (response.success) {
        return response.data as ReviewProductResponse[];
      } else {
        throw new Error(response.message);
      }
    },
    []
  );

  const { data, isValidating, error, mutate } = useSWR<ReviewProductResponse[]>(
    [productId, 1, 10],
    {
      fetcher: reviewFetcher,
      revalidateOnMount: true,
      revalidateOnFocus: false,
    }
  );

  const totalRating = useMemo(
    () =>
      data
        ? data.reduce((acc, review) => acc + review.rating, 0) / data.length
        : 0,
    [data]
  );

  const handleSubmitReview = () => {
    if (newReview.rating === 0 || newReview.comment === "") {
      return;
    }
    // TODO: Call API to create review
    if (user?.id) {
      const request: ReviewRequest = {
        productID: productId,
        userId: user?.id,
        rating: newReview.rating,
        comment: newReview.comment,
      };
      postApi(API_URL.review, request).then((res: ApiResponse) => {
        if (res.success) {
          enqueueSnackbar("Đánh giá thành công", {
            variant: "success",
          });
          setNewReview({ rating: 0, comment: "" });
          mutate();
        } else {
          enqueueSnackbar(res.message, { variant: "error" });
        }
      });
    } else {
      enqueueSnackbar("Vui lòng đăng nhập đê để thêm nhận xét", {
        variant: "error",
      });
    }
  };

  if (isValidating) {
    return <CircularProgress />;
  }

  if (error) {
    enqueueSnackbar("Lỗi xảy ra khi lấy dữ liệu", { variant: "error" });
  }

  return (
    <Box mt={4}>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        Đánh giá sản phẩm
      </Typography>
      <Box display="flex" alignItems="center" mb={2}>
        <Rating value={totalRating} readOnly precision={0.5} />
        <Typography variant="body1" ml={1}>
          ({totalRating.toFixed(1)})
        </Typography>
      </Box>
      <Divider sx={{ my: 2 }} />
      {user && (
        <Box mb={4}>
          <Typography variant="h6" gutterBottom>
            Viết đánh giá của bạn
          </Typography>
          <Rating
            value={newReview.rating}
            onChange={(_, value) =>
              setNewReview({ ...newReview, rating: value || 0 })
            }
          />
          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            placeholder="Nhập đánh giá của bạn..."
            value={newReview.comment}
            onChange={(e) =>
              setNewReview({ ...newReview, comment: e.target.value })
            }
            sx={{ my: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmitReview}
          >
            Gửi đánh giá
          </Button>
        </Box>
      )}
      <Box>
        {data?.map((review) => (
          <Box key={review.id} mb={2}>
            <Box display="flex" alignItems="center" mb={1}>
              <Avatar sx={{ mr: 2 }}>
                <Image
                  src={
                    review.userImageUrl
                      ? review.userImageUrl
                      : "/user-avatar.png"
                  }
                  width={40}
                  height={40}
                  alt={review.userName}
                />
              </Avatar>
              <Typography variant="subtitle1">{review.userName}</Typography>
            </Box>
            <Rating value={review.rating} readOnly size="small" />
            <Typography variant="body2" paragraph>
              {review.comment}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {new Date(review.createdDate).toLocaleDateString()}
            </Typography>
            <Divider sx={{ mt: 2 }} />
          </Box>
        ))}
      </Box>
    </Box>
  );
}
