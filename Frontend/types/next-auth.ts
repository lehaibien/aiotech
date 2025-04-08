import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    role: string;
    accessToken: string | undefined;
    refreshToken: string | undefined;
  }
  interface Session extends DefaultSession {
    user: User;
  }
}

import { JWT } from "next-auth/jwt";

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    /** OpenID ID Token */
    id: string;
    role: string | undefined;
    accessToken: string | undefined;
    refreshToken: string | undefined;
  }
}
