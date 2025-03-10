import { API_URL } from "@/constant/apiUrl";
import { EMPTY_UUID } from "@/constant/common";
import { getByIdApi } from "@/lib/apiClient";
import { parseUUID } from "@/lib/utils";
import { PostResponse } from "@/types";
import "server-only";
import { PostUpsertForm } from "../../../../features/dashboard/posts/PostUpsertForm";

export default async function UpsertPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined };
}) {
  let post: PostResponse = {
    id: EMPTY_UUID,
    title: "",
    content: "",
    imageUrl: "",
    isPublished: false,
    tags: [],
    createdDate: new Date(),
  };
  const parsedId = parseUUID(searchParams?.id ?? "");
  if (parsedId !== EMPTY_UUID) {
    const response = await getByIdApi(API_URL.post, { id: parsedId });
    if (response.success) {
      post = response.data as PostResponse;
    }
  }
  return <PostUpsertForm post={post} />;
}
