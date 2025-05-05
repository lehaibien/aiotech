import { useSession } from "next-auth/react";
import { useMemo } from "react";

export function useUserId() {
  const { data: session } = useSession();
  const userId = useMemo(() => session?.user?.id, [session?.user?.id]);
  return userId;
}
