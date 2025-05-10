import { theme } from "@/config/theme";
import { SignalRProvider } from "@/contexts/SignalRProvider";
import "@mantine/charts/styles.css";
import {
  ColorSchemeScript,
  mantineHtmlProps,
  MantineProvider,
} from "@mantine/core";
import "@mantine/core/styles.css";
import { DatesProvider } from "@mantine/dates";
import "@mantine/dates/styles.css";
import "@mantine/dropzone/styles.css";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import "@mantine/tiptap/styles.css";
import "dayjs/locale/vi";
import { Provider as JotaiProvider } from "jotai";
import "mantine-datatable/styles.layer.css";
import { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { Be_Vietnam_Pro } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import React from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "AioTech",
    template: "%s | AioTech",
  },
  description:
    "Aiotech là nơi mọi người mua sắm thiết bị điện tử, linh kiện pc, laptop và gaming gear.",
  keywords: ["e-commerce", "technology", "tech", "shopping", "pc", "laptop"],
  openGraph: {
    title: "Aiotech",
    description:
      "Aiotech là nơi mọi người mua sắm thiết bị điện tử, linh kiện pc, laptop và gaming gear.",
    url: "https://aiotech.cloud",
    siteName: "Aiotech",
    images: [
      {
        url: "https://aiotech.cloud/images/logo.png",
        width: 500,
        height: 500,
        alt: "Aiotech logo",
      },
    ],
  },
};

const beVietnamPro = Be_Vietnam_Pro({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-beVietnamPro",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" {...mantineHtmlProps}>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <ColorSchemeScript defaultColorScheme="auto" />
        {/* Umami below*/}
        {/* <script
          defer
          src="http://localhost:8000/script.js"
          data-website-id="68fd00af-c00c-4758-9acd-12d56487b8a2"
        /> */}
      </head>
      <body className={`${beVietnamPro.className} antialiased`}>
        <NuqsAdapter>
          <SessionProvider>
            <DatesProvider
              settings={{
                locale: "vi",
                firstDayOfWeek: 1,
                timezone: "UTC",
              }}
            >
              <MantineProvider
                theme={theme}
                defaultColorScheme="auto"
                classNamesPrefix="aiotech"
              >
                <ModalsProvider>
                  <SignalRProvider>
                    <JotaiProvider>{children}</JotaiProvider>
                  </SignalRProvider>
                </ModalsProvider>
                <Notifications limit={3} />
              </MantineProvider>
            </DatesProvider>
          </SessionProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
