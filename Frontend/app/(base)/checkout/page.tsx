import { API_URL } from "@/constant/apiUrl";
import { CheckoutComponent } from "@/features/checkout/CheckoutComponent";
import { getApi } from "@/lib/apiClient";
import { auth } from "@/lib/auth";
import { SearchParams, UserProfileResponse } from "@/types";
import "server-only";

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { error } = await searchParams;
  const isError = Boolean(error);
  const session = await auth();
  let profile: UserProfileResponse = {
    familyName: "",
    givenName: "",
    address: "",
    avatarUrl: "",
    email: "",
    phoneNumber: "",
  };
  const response = await getApi(API_URL.user + `/${session?.user.id}/profile`);
  if (response.success) {
    profile = response.data as UserProfileResponse;
  } else {
    throw new Error(response.message);
  }
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
