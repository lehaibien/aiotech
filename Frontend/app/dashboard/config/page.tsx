import { API_URL } from "@/constant/apiUrl";
import { getApi } from "@/lib/apiClient";
import { BannerConfiguration, EmailConfiguration } from "@/types/sys-config";
import { Stack, Title } from "@mantine/core";
import { BannerConfigForm } from "./BannerConfigForm";
import { EmailConfigForm } from "./EmailConfigForm";

export default async function ConfigurationPage() {
  let bannerConfig: BannerConfiguration = {
    title: "",
    description: "",
    imageUrl: "",
  };

  let emailConfig: EmailConfiguration = {
    email: "",
    password: "",
    host: "",
    port: 0,
  };

  const bannerResponse = await getApi(API_URL.bannerConfig);
  if (bannerResponse.success) {
    bannerConfig = bannerResponse.data as BannerConfiguration;
  } else {
    console.error("Failed to load banner config: ", bannerResponse.message);
  }

  const emailResponse = await getApi(API_URL.emailConfig);
  if (emailResponse.success) {
    emailConfig = emailResponse.data as EmailConfiguration;
  } else {
    console.error("Failed to load email config: ", emailResponse.message);
  }
  return (
    <Stack>
      <Title order={5}>Cài đặt hệ thống</Title>
      <BannerConfigForm
        title={bannerConfig.title}
        description={bannerConfig.description}
        imageUrl={bannerConfig.imageUrl}
      />
      <EmailConfigForm
        email={emailConfig.email}
        password={emailConfig.password}
        host={emailConfig.host}
        port={emailConfig.port}
      />
    </Stack>
  );
}
