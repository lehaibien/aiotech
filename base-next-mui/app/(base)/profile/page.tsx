import ProfileTab from "@/features/profile/ProfileTab";
import "server-only";

export default function ProfilePage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined };
}) {
  const activeTab = searchParams?.tab ? Number(searchParams?.tab) : 0;
  return <ProfileTab defaultTab={activeTab} />;
}
