import { Footer } from "@/components/layout/base/Footer";
import { Header } from "@/components/layout/base/Header";
import { SubHeader } from "@/components/layout/base/SubHeader";
import { API_URL } from "@/constant/apiUrl";
import { getApi } from "@/lib/apiClient";
import { ComboBoxItem } from "@/types";
import { Container, rem, Stack } from "@mantine/core";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Aiotech",
    template: "%s | Aiotech",
  },
  description:
    "Aiotech là nơi chuyên cung cấp linh kiện điện tử, máy tính, máy tính xách tay và đồ chơi máy tính.",
  keywords: [
    "technology",
    "tech",
    "shopping",
    "pc",
    "laptop",
    "electronics",
    "aiotech",
  ],
  applicationName: "AioTech",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let categories: ComboBoxItem[] = [];
  const response = await getApi(API_URL.categoryComboBox);
  if (response.success) {
    categories = response.data as ComboBoxItem[];
  }
  return (
    <Container
      fluid
      px={{
        base: 0,
        md: rem(96),
      }}
      pos="relative"
    >
      <Stack gap="sm" py="xs">
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            backgroundColor: "white",
            borderBottom: "1px solid var(--mantine-color-gray-2)",
          }}
        >
          <Header categories={categories} />
          <SubHeader categories={categories} />
        </div>
        <main>{children}</main>
        <Footer />
      </Stack>
    </Container>
  );
}
