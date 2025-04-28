import { API_URL } from "@/constant/apiUrl";
import { CheckoutComponent } from "@/features/checkout/CheckoutComponent";
import { getApi } from "@/lib/apiClient";
import { auth } from "@/lib/auth";
import { SearchParams, UserProfileResponse } from "@/types";

async function getUserProfile(id: string) {
  const response = await getApi(API_URL.user + `/${id}/profile`);
  if (response.success) {
    return response.data as UserProfileResponse;
  } else {
    return {
      familyName: "",
      givenName: "",
      address: "",
      avatarUrl: "",
      email: "",
      phoneNumber: "",
    };
  }
}

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { error } = await searchParams;
  const isError = Boolean(error);
  const session = await auth();
  const profile = await getUserProfile(session?.user.id || "");
  const fullName = profile.familyName
    ? profile.familyName + " " + profile.givenName
    : profile.givenName;
  return (
    <CheckoutComponent
      name={fullName}
      phoneNumber={profile.phoneNumber}
      address={profile.address}
      isError={isError}
    />
  );
}
