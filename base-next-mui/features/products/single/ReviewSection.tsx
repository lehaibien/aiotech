"use client";

import { API_URL } from "@/constant/apiUrl";
import { deleteApi, getListApi, postApi, putApi } from "@/lib/apiClient";
import {
  ApiResponse,
  GetListReviewByProductIdRequest,
  ReviewProductResponse,
  ReviewRequest,
} from "@/types";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Pagination,
  Paper,
  Rating,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { UUID } from "crypto";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useSnackbar } from "notistack";
import { useCallback, useMemo, useState } from "react";
import useSWR from "swr";
import { ReviewSectionDeleteButton } from "./ReviewSectionDeleteButton";

type ReviewSectionProps = {
  productId: UUID;
};

export default function ReviewSection({ productId }: ReviewSectionProps) {
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
  const pageSize = 5;

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

  const { data, isValidating, error } = useSWR<ReviewProductResponse[]>(
    [productId, currentPage, pageSize],
    {
      fetcher: reviewFetcher,
      revalidateOnMount: true,
      revalidateOnFocus: false,
    }
  );

  const totalRating = useMemo(
    () =>
      data && data.length > 0
        ? data.reduce((acc, review) => acc + review.rating, 0) / data.length
        : 0,
    [data]
  );

  const handleSubmitReview = () => {
    if (newReview.rating === 0 || newReview.comment === "") {
      return;
    }
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
      console.log(response);
      if (!response.success) {
        enqueueSnackbar(response.message, { variant: "error" });
        return;
      }
      enqueueSnackbar("Xóa đánh giá thành công", {
        variant: "success",
      });
      if(window) {
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
      if(window) {
        window.location.reload();
      }
    }
  };

  if (error) {
    enqueueSnackbar("Lỗi xảy ra khi lấy dữ liệu", { variant: "error" });
  }

  return (
    <Box>
      {/* Review Summary */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
          Đánh giá sản phẩm
        </Typography>
        <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              flexDirection: {
                xs: "column",
                md: "row",
              },
            }}
          >
            <Box sx={{ textAlign: "center", minWidth: 120 }}>
              <Typography variant="h3" color="primary.main" fontWeight="bold">
                {totalRating.toFixed(1)}
              </Typography>
              <Rating
                value={totalRating}
                readOnly
                precision={0.5}
                size="large"
                sx={{ mt: 1 }}
              />
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                ({data?.length || 0} đánh giá)
              </Typography>
            </Box>
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
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                Đánh giá từ khách hàng
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Chia sẻ trải nghiệm của bạn để giúp người khác đưa ra quyết định
                tốt hơn.
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Write Review Section */}
      {user ? (
        <Paper elevation={1} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ color: "primary.main" }}>
            Viết đánh giá của bạn
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Rating
              value={newReview.rating}
              onChange={(_, value) =>
                setNewReview({ ...newReview, rating: value || 0 })
              }
              size="large"
              icon={<StarIcon fontSize="inherit" color="primary" />}
              emptyIcon={<StarBorderIcon fontSize="inherit" />}
            />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
              {newReview.rating > 0
                ? `${newReview.rating}/5 sao`
                : "Chọn đánh giá"}
            </Typography>
          </Box>
          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
            value={newReview.comment}
            onChange={(e) =>
              setNewReview({ ...newReview, comment: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleSubmitReview}
            sx={{ px: 4 }}
          >
            Gửi đánh giá
          </Button>
        </Paper>
      ) : (
        <Alert severity="info" sx={{ mb: 4 }}>
          Vui lòng đăng nhập để viết đánh giá cho sản phẩm này.
        </Alert>
      )}

      {/* Reviews List */}
      <Box>
        {isValidating && !data ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : data?.length === 0 ? (
          <Paper sx={{ p: 3, textAlign: "center", borderRadius: 2 }}>
            <Typography variant="body1" color="text.secondary">
              Chưa có đánh giá nào cho sản phẩm này.
            </Typography>
          </Paper>
        ) : (
          <Stack spacing={2}>
            {data?.map((review, index) => (
              <Card
                key={review.id}
                sx={{ borderRadius: 2, position: "relative" }}
              >
                {index === 0 &&
                  user?.name &&
                  data[0].userName === user.name && (
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
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Avatar sx={{ mr: 2 }}>
                      <Image
                        src={review.userImageUrl || "/user-avatar.png"}
                        width={40}
                        height={40}
                        alt={review.userName}
                      />
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      {editingIndex === index ? (
                        <>
                          <Rating
                            value={editedComment.rating}
                            onChange={(_, value) =>
                              setEditedComment({
                                ...editedComment,
                                rating: value || 0,
                              })
                            }
                            size="medium"
                            sx={{ mb: 2 }}
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
                              mt: 0.5,
                            }}
                          >
                            <Rating
                              value={review.rating}
                              readOnly
                              size="small"
                            />
                            <Typography variant="body2" color="text.secondary">
                              •{" "}
                              {new Date(
                                review.createdDate
                              ).toLocaleDateString()}
                            </Typography>
                          </Box>
                          <Typography variant="body1" sx={{ mt: 1 }}>
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
      </Box>
    </Box>
  );
}
