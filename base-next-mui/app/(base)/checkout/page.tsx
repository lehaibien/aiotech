import { CheckoutComponent } from "@/components/base/checkout/CheckoutComponent";
import { API_URL } from "@/constant/apiUrl";
import { getApi } from "@/lib/apiClient";
import { auth } from "@/lib/auth";
import { UserProfileResponse } from "@/types";
import { redirect } from "next/navigation";
import "server-only";

export default async function CheckoutPage() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }
  let profile: UserProfileResponse = {
    familyName: "",
    givenName: "",
    address: "",
    avatarUrl: "",
    email: "",
    phoneNumber: "",
  };
  const response = await getApi(API_URL.user + `/${session.user.id}/profile`);
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
    />
  );
}
