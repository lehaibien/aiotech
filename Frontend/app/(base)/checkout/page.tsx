import { API_URL } from "@/constant/apiUrl";
import { CheckoutComponent } from "@/features/checkout/CheckoutComponent";
import { getApi } from "@/lib/apiClient";
import { auth } from "@/lib/auth";
import { SearchParams, UserProfileResponse } from "@/types";

/**
 * Retrieves a user's profile by ID from the API.
 *
 * Returns the user's profile data if the API call is successful; otherwise, returns a default profile object with empty fields.
 *
 * @param id - The unique identifier of the user whose profile is to be fetched.
 * @returns The user's profile data, or a default profile object if the API call fails.
 */
async function getUserProfile(id: string) {
  const response = await getApi(API_URL.user + `/${id}/profile`);
  if (response.success) {
    return response.data as UserProfileResponse;
  } else {
    console.log(response.message);
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

/**
 * Renders the checkout page with user profile information and error state.
 *
 * Retrieves the current user session and profile data, then displays the checkout component with the user's name, phone number, address, and an error indicator based on the search parameters.
 */
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
