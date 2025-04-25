import { API_URL } from "@/constant/apiUrl";
import { getApi } from "@/lib/apiClient";
import { BannerConfiguration, EmailConfiguration } from "@/types/sys-config";
import { Stack, Typography } from "@mui/material";
import { BannerConfigForm } from "./BannerConfigForm";
import { EmailConfigForm } from "./EmailConfigForm";

/**
 * Displays the system configuration page with forms for editing banner and email settings.
 *
 * Fetches banner and email configuration data from the API and renders corresponding forms with the retrieved or default values.
 *
 * @returns A React element containing the configuration forms.
 *
 * @remark If configuration data cannot be fetched, the forms are rendered with default empty values.
 */
export default async function ConfigurationPage() {
  let banner: BannerConfiguration = {
    title: "",
    description: "",
    imageUrl: "",
  };

  let email: EmailConfiguration = {
    email: "",
    password: "",
    host: "",
    port: 0,
  };

  const bannerResponse = await getApi(API_URL.bannerConfig);
  if (bannerResponse.success) {
    banner = bannerResponse.data as BannerConfiguration;
  } else {
    console.error("Failed to load banner config: ", bannerResponse.message);
  }

  const emailResponse = await getApi(API_URL.emailConfig);
  if (emailResponse.success) {
    email = emailResponse.data as EmailConfiguration;
  } else {
    console.error("Failed to load email config: ", emailResponse.message);
  }
  return (
    <Stack spacing={2}>
      <Typography variant="h5">Cài đặt hệ thống</Typography>
      <BannerConfigForm banner={banner} />
      <EmailConfigForm email={email} />
    </Stack>
  );
}
