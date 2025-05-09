"use client";

import { API_URL } from "@/constant/apiUrl";
import { deleteApi, putApi } from "@/lib/apiClient";
import { formatDate } from "@/lib/utils";
import { UUID } from "@/types";
import { Alert, Box, Button, Card, Center, Divider, Flex, Group, Loader, Pagination, Rating, Stack, Text, Textarea, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { useProductReview } from "./hooks/useProductReview";
import { WriteReviewSection } from "./WriteReviewSection";

type ReviewSectionProps = {
  productId: UUID;
};

export const ReviewSection = ({ productId }: ReviewSectionProps) => {
  const pageSize = 5;
  const { data: session } = useSession();
  const user = useMemo(() => session?.user, [session]);
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
    modals.openConfirmModal({
      title: "Xác nhận xóa",
      children: "Bạn có chắc chắn muốn xóa đánh giá này?",
      labels: { confirm: "Xóa", cancel: "Hủy" },
      confirmProps: { color: "red" },
      onConfirm: async () => {
        if (data && data[index].id) {
          const response = await deleteApi(API_URL.review + `/${data[index].id}`);
          if (!response.success) {
            notifications.show({
              title: "Lỗi xảy ra khi xóa đánh giá",
              message: response.message,
              color: "red",
            });
            return;
          }
          notifications.show({
            title: "Xóa đánh giá thành công",
            message: "Đánh giá của bạn đã được xóa thành công.",
            color: "green",
          });
          if (window) {
            window.location.reload();
          }
        }
      }
    })
  };

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
        notifications.show({
          title: "Lỗi xảy ra khi cập nhật đánh giá",
          message: response.message,
          color: "red",
        })
        return;
      }
      setEditingIndex(null);
      notifications.show({
        title: "Cập nhật đánh giá thành công",
        message: "Đánh giá của bạn đã được cập nhật thành công.",
        color: "green",
      })
      if (window) {
        window.location.reload();
      }
    }
  };

  if (error) {
    notifications.show({
      title: "Lỗi xảy ra khi lấy dữ liệu",
      message: error.message,
      color: "red",
    });
  }

  return (
    <Stack gap="md">
      <Title order={5}>Đánh giá sản phẩm</Title>
      <Card withBorder p="md">
        <Flex
          direction={{
            base: "column",
            md: "row",
          }}
          gap="md"
          align="center"
        >
          <Group gap="xs">
            <Text size="xl" fw={600}>{totalRating.toFixed(1)}</Text>
            <Rating value={totalRating} readOnly size="lg" />
            <Text size="sm" c="dimmed">({data?.length || 0} đánh giá)</Text>
          </Group>
          <Divider orientation="vertical" />
          <Box style={{ flex: 1 }}>
            <Text size="lg" fw={500}>Đánh giá từ khách hàng</Text>
            <Text size="sm" c="dimmed">
              Chia sẻ trải nghiệm của bạn để giúp người khác đưa ra quyết định tốt hơn.
            </Text>
          </Box>
        </Flex>
      </Card>

      {user ? (
        <WriteReviewSection productId={productId} />
      ) : (
        <Alert color="blue" title="Thông báo">
          Vui lòng đăng nhập để viết đánh giá cho sản phẩm này.
        </Alert>
      )}

      {isValidating && !data ? (
        <Center>
          <Loader size="lg" />
        </Center>
      ) : data?.length === 0 ? (
        <Center>
          <Text c="dimmed">Chưa có đánh giá nào cho sản phẩm này.</Text>
        </Center>
      ) : (
        <Stack gap="md">
          {data?.map((review, index) => (
            <Card key={review.id} withBorder>
              {index === 0 && user?.name && data[0].userName === user.name && (
                <Group justify="flex-end" gap="xs" mb="sm">
                  {editingIndex === index ? (
                    <>
                      <Button onClick={() => handleSaveEdit(index)}>
                        Lưu
                      </Button>
                      <Button variant="light" onClick={() => setEditingIndex(null)}>
                        Hủy
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button size='sm' onClick={() => handleEditComment(index)}>
                        Sửa
                      </Button>
                      <Button size="sm" variant="light" color="red" onClick={() => handleDeleteComment(index)}>
                        Xóa
                      </Button>
                    </>
                  )}
                </Group>
              )}
              <Group align="flex-start" gap="md">
                <Image
                  src={review.userImageUrl || "/user-avatar.png"}
                  width={40}
                  height={40}
                  alt={review.userName}
                  style={{
                    borderRadius: "50%",
                    objectFit: "fill",
                  }}
                />
                <Box style={{ flex: 1 }}>
                  {editingIndex === index ? (
                    <Stack gap="sm">
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
                      <Textarea
                        value={editedComment.comment}
                        onChange={(e) =>
                          setEditedComment({
                            ...editedComment,
                            comment: e.target.value,
                          })
                        }
                        placeholder="Nhập đánh giá của bạn"
                        minRows={3}
                      />
                    </Stack>
                  ) : (
                    <>
                      <Text fw={500} size="sm">{review.userName}</Text>
                      <Group gap="xs" my="xs">
                        <Rating value={review.rating} readOnly size="sm" />
                        <Text size="xs" c="dimmed">{formatDate(review.createdDate)}</Text>
                      </Group>
                      <Text size="sm">{review.comment}</Text>
                    </>
                  )}
                </Box>
              </Group>
            </Card>
          ))}
          {data && data.length > pageSize && (
            <Group justify="center">
              <Pagination
                total={Math.ceil(data.length / pageSize)}
                value={currentPage}
                onChange={setCurrentPage}
              />
            </Group>
          )}
        </Stack>
      )}
    </Stack>
  );
};
