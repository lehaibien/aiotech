import { API_URL } from "@/constant/apiUrl";
import { ProfileForm } from "@/features/profile/ProfileForm";
import { getApi } from "@/lib/apiClient";
import { auth } from "@/lib/auth";
import { UserProfileResponse } from "@/types";

async function getProfileData(userId: string) {
  const response = await getApi(API_URL.user + `/${userId}/profile`);
  if (response.success) {
    return response.data as UserProfileResponse;
  } else {
    console.error(response.message);
    return undefined;
  }
}

export default async function Page() {
  const session = await auth();
  const profileData = await getProfileData(session?.user.id ?? "");
  return (
    <ProfileForm
      familyName={profileData?.familyName ?? ""}
      givenName={profileData?.givenName ?? ""}
      email={profileData?.email ?? ""}
      phoneNumber={profileData?.phoneNumber ?? ""}
      address={profileData?.address ?? ""}
      avatarUrl={profileData?.avatarUrl ?? ""}
    />
  );
}
