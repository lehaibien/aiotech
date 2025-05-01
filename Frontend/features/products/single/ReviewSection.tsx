"use client";

import { API_URL } from "@/constant/apiUrl";
import { deleteApi, postApi, putApi } from "@/lib/apiClient";
import { formatDate } from "@/lib/utils";
import { ApiResponse, ReviewRequest, UUID } from "@/types";
import { Center, Flex, Group, Rating, Stack, Text, Title } from "@mantine/core";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Pagination,
  TextField,
  Typography
} from "@mui/material";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useSnackbar } from "notistack";
import { useMemo, useState } from "react";
import { useProductReview } from "./hooks/useProductReview";
import { ReviewSectionDeleteButton } from "./ReviewSectionDeleteButton";
import { WriteReviewSection } from "./WriteReviewSection";

type ReviewSectionProps = {
  productId: UUID;
};

export default function ReviewSection({ productId }: ReviewSectionProps) {
  const pageSize = 5;
  const { enqueueSnackbar } = useSnackbar();
  const { data: session } = useSession();
  const user = useMemo(() => session?.user, [session]);
  const [newReview, setNewReview] = useState({ rating: 0, comment: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedComment, setEditedComment] = useState({
    rating: 0,
    comment: "",
  });

  const { data, isValidating, error } = useProductReview({
    productId: productId,
    page: currentPage,
    pageSize: pageSize,
  });

  const totalRating = useMemo(
    () =>
      data && data.length > 0
        ? data.reduce((acc, review) => acc + review.rating, 0) / data.length
        : 0,
    [data]
  );

  const handleSubmitReview = () => {
    if (user?.id) {
      const request: ReviewRequest = {
        productID: productId,
        userId: user.id,
        rating: newReview.rating,
        comment: newReview.comment,
      };
      postApi(API_URL.review, request).then((res: ApiResponse) => {
        if (res.success) {
          enqueueSnackbar("Đánh giá thành công", {
            variant: "success",
          });
          setNewReview({ rating: 0, comment: "" });
          if (window) {
            window.location.reload();
          }
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

  const handleEditComment = (index: number) => {
    const comment = data?.[index];
    if (comment) {
      setEditingIndex(index);
      setEditedComment({
        rating: comment.rating,
        comment: comment.comment,
      });
    }
  };

  const handleDeleteComment = async (index: number) => {
    if (data && data[index].id) {
      const response = await deleteApi(API_URL.review + `/${data[index].id}`);
      if (!response.success) {
        enqueueSnackbar(response.message, { variant: "error" });
        return;
      }
      enqueueSnackbar("Xóa đánh giá thành công", {
        variant: "success",
      });
      if (window) {
        window.location.reload();
      }
    }
  };

  // Add save edit handler
  const handleSaveEdit = async (index: number) => {
    if (data && data[index] && user?.id) {
      const updatedComment = {
        id: data[index].id,
        productID: productId,
        userId: user?.id,
        rating: editedComment.rating,
        comment: editedComment.comment,
      };
      const response = await putApi(API_URL.review, updatedComment);
      if (!response.success) {
        enqueueSnackbar(response.message, { variant: "error" });
        return;
      }
      setEditingIndex(null);
      enqueueSnackbar("Cập nhật đánh giá thành công", {
        variant: "success",
      });
      if (window) {
        window.location.reload();
      }
    }
  };

  if (error) {
    enqueueSnackbar("Lỗi xảy ra khi lấy dữ liệu", { variant: "error" });
  }

  return (
    <Stack gap={4}>
      <Title order={5}>Đánh giá sản phẩm</Title>
      <Flex
        direction={{
          xs: "column",
          md: "row",
        }}
        gap={8}
        p={4}
      >
        <Group gap={4}>
          <Text size="xl">{totalRating.toFixed(1)}</Text>
          <Rating value={totalRating} readOnly size="md" />
          <Typography variant="body2" color="text.secondary">
            ({data?.length || 0} đánh giá)
          </Typography>
        </Group>
        <Divider
          orientation="vertical"
          flexItem
          sx={{
            display: {
              xs: "none",
              md: "block",
            },
          }}
        />
        <div
          style={{
            flex: 1,
          }}
        >
          <Text size="lg">Đánh giá từ khách hàng</Text>
          <Text size="md" c="gray">
            Chia sẻ trải nghiệm của bạn để giúp người khác đưa ra quyết định tốt
            hơn.
          </Text>
        </div>
      </Flex>

      {user ? (
        <WriteReviewSection handleSubmitReview={handleSubmitReview} />
      ) : (
        <Alert severity="info">
          Vui lòng đăng nhập để viết đánh giá cho sản phẩm này.
        </Alert>
      )}

      {isValidating && !data ? (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </Box>
      ) : data?.length === 0 ? (
        <Center>
          <Text c="gray">Chưa có đánh giá nào cho sản phẩm này.</Text>
        </Center>
      ) : (
        <Stack gap={4}>
          {data?.map((review, index) => (
            <Card
              key={review.id}
              sx={{
                position: "relative",
                backgroundColor: "background.default",
                borderRadius: 2,
              }}
            >
              {index === 0 && user?.name && data[0].userName === user.name && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    display: "flex",
                    gap: 1,
                  }}
                >
                  {editingIndex === index ? (
                    <>
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => handleSaveEdit(index)}
                        sx={{ minWidth: 80 }}
                      >
                        Lưu
                      </Button>
                      <Button
                        size="small"
                        color="secondary"
                        onClick={() => setEditingIndex(null)}
                      >
                        Hủy
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        size="small"
                        onClick={() => handleEditComment(index)}
                        sx={{ color: "text.secondary" }}
                      >
                        Sửa
                      </Button>
                      <ReviewSectionDeleteButton
                        index={index}
                        handleDelete={handleDeleteComment}
                      />
                    </>
                  )}
                </Box>
              )}
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Image
                    src={review.userImageUrl || "/user-avatar.png"}
                    width={40}
                    height={40}
                    alt={review.userName}
                    style={{
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                  <Box>
                    {editingIndex === index ? (
                      <>
                        <Rating
                          value={editedComment.rating}
                          onChange={(value) =>
                            setEditedComment({
                              ...editedComment,
                              rating: value || 0,
                            })
                          }
                          size="md"
                        />
                        <TextField
                          fullWidth
                          multiline
                          rows={3}
                          value={editedComment.comment}
                          onChange={(e) =>
                            setEditedComment({
                              ...editedComment,
                              comment: e.target.value,
                            })
                          }
                        />
                      </>
                    ) : (
                      <>
                        <Typography variant="subtitle1" fontWeight="medium">
                          {review.userName}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <Rating value={review.rating} readOnly size="sm" />
                          <Typography variant="body2" color="text.secondary">
                            {formatDate(review.createdDate)}
                          </Typography>
                        </Box>
                        <Typography variant="body1">
                          {review.comment}
                        </Typography>
                      </>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
          {data && data.length > pageSize && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <Pagination
                count={Math.ceil(data.length / pageSize)}
                page={currentPage}
                onChange={(_event, value) => setCurrentPage(value)}
                color="primary"
              />
            </Box>
          )}
        </Stack>
      )}
    </Stack>
  );
}
