import "server-only";

import RootClientProvider from "@/contexts/RootClientProvider";
import { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { Be_Vietnam_Pro } from "next/font/google";
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
    <html lang="vi" suppressHydrationWarning>
      <head>
        <script
          defer
          src="http://localhost:8000/script.js"
          data-website-id="68fd00af-c00c-4758-9acd-12d56487b8a2"
        />
      </head>
      <body className={`${beVietnamPro.className} antialiased`}>
        <SessionProvider>
          <RootClientProvider>{children}</RootClientProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
