import { Stack, Typography } from "@mui/material";
import { ConfigurationForm } from "./ConfigurationForm";
import { BannerConfiguration, EmailConfiguration } from "@/types/config";
import { API_URL } from "@/constant/apiUrl";
import { getApi } from "@/lib/apiClient";

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
    <Stack gap={2}>
      <Typography variant="h5">Cài đặt hệ thống</Typography>
      <ConfigurationForm banner={banner} email={email} />
    </Stack>
  );
}
