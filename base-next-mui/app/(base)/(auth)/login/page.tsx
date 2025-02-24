import "server-only";

import LoginComponent from "@/components/base/auth/login/LoginComponent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
};

async function Page({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined };
}) {
  const redirect = searchParams?.redirect ?? "/";
  return <LoginComponent redirectTo={redirect} />;
}

export default Page;
