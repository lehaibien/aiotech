import { API_URL } from "@/constant/apiUrl";
import { EMPTY_UUID } from "@/constant/common";
import { PostUpsertForm } from "@/features/dashboard/posts/upsert/PostUpsertForm";
import { getApi } from "@/lib/apiClient";
import { parseUUID } from "@/lib/utils";
import { PostUpdateResponse, SearchParams } from "@/types";
import { Stack, Title } from "@mantine/core";

export default async function UpsertPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { id } = await searchParams;
  const parsedId = parseUUID(id);
  let post: PostUpdateResponse = {
    id: EMPTY_UUID,
    title: "",
    slug: "",
    content: "",
    imageUrl: "",
    isPublished: false,
    tags: [],
  };
  if (parsedId !== EMPTY_UUID) {
    const response = await getApi(API_URL.post + `/${parsedId}/update`);
    if (response.success) {
      post = response.data as PostUpdateResponse;
    }
  }
  return (
    <Stack>
      <Title order={4}>
        {post.id === null || post.id === EMPTY_UUID ? "Thêm mới" : "Cập nhật"}{" "}
        bài viết
      </Title>
      <PostUpsertForm post={post} />
    </Stack>
  );
}
