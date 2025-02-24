import { API_URL } from "@/constant/apiUrl";
import { ApiResponse, UserLoginRequest } from "@/types";
import { jwtDecode } from "jwt-decode";
import NextAuth, { User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Facebook from "next-auth/providers/facebook";
import Google from "next-auth/providers/google";
import { postApi } from "./apiClient";

interface JwtPayload {
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress": string;
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/thumbprint": string;
  jti: string;
  exp: number;
  iss: string;
  aud: string;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  providers: [
    Google({
      async profile(profile): Promise<User> {
        const request = {
          email: profile.email,
          familyName: profile.family_name,
          givenName: profile.given_name,
          imageUrl: profile.picture,
        };
        const response = await postApi(API_URL.socialLogin, request);
        if (!response.success) {
          return {
            id: "",
            name: "",
            email: "",
            image: "",
            role: "",
            accessToken: "",
            refreshToken: "",
          };
        }
        const jwtResult = response.data as {
          accessToken: string;
          refreshToken: string;
        };
        const payload = decodeJwt(jwtResult.accessToken);
        return {
          id: payload[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
          ],
          name: payload[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
          ],
          email:
            payload[
              "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
            ],
          image:
            payload[
              "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/thumbprint"
            ],
          role: payload[
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
          ],
          accessToken: jwtResult.accessToken,
          refreshToken: jwtResult.refreshToken,
        };
      },
    }),
    Facebook({
      async profile(profile): Promise<User> {
        const name = profile.name.split(" ");
        const givenName = name.pop();
        const familyName = name.join(" ");
        const request = {
          email: profile.email,
          familyName: familyName,
          givenName: givenName,
          imageUrl: profile.picture.data.url,
        };
        const response = await postApi(API_URL.socialLogin, request);
        if (!response.success) {
          return {
            id: "",
            name: "",
            email: "",
            image: "",
            role: "",
            accessToken: "",
            refreshToken: "",
          };
        }
        const jwtResult = response.data as {
          accessToken: string;
          refreshToken: string;
        };
        const payload = decodeJwt(jwtResult.accessToken);
        return {
          id: payload[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
          ],
          name: payload[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
          ],
          email:
            payload[
              "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
            ],
          image:
            payload[
              "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/thumbprint"
            ],
          role: payload[
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
          ],
          accessToken: jwtResult.accessToken,
          refreshToken: jwtResult.refreshToken,
        };
      },
    }),
    Credentials({
      credentials: {
        username: {},
        password: {},
      },
      async authorize(credentials) {
        const data: UserLoginRequest = {
          username: credentials.username as string,
          password: credentials.password as string,
        };
        const response = await postApi(API_URL.login, data);
        if (!response.success) {
          return null;
        }
        const jwtResult = response.data as {
          accessToken: string;
          refreshToken: string;
        };
        const payload = decodeJwt(jwtResult.accessToken);
        return {
          id: payload[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
          ],
          name: payload[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
          ],
          email:
            payload[
              "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
            ],
          image:
            payload[
              "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/thumbprint"
            ],
          role: payload[
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
          ],
          accessToken: jwtResult.accessToken,
          refreshToken: jwtResult.refreshToken,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // token.id = user.id || '';
        // token.email = user.email;
        // token.role = user.role;
        // token.accessToken = user.accessToken;
        // token.refreshToken = user.refreshToken;
        return {
          ...user,
          ...token,
        };
      }
      if (token.accessToken && isTokenExpired(token.accessToken, 15)) {
        try {
          const request = {
            accessToken: token.accessToken,
            refreshToken: token.refreshToken,
          };
          process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}auth/refresh-token`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json", // Add this header
              },
              body: JSON.stringify(request),
            }
          );
          if (response.status === 200) {
            const json = (await response.json()) as ApiResponse;
            const data = json.data as {
              accessToken: string;
              refreshToken: string;
            };
            token.accessToken = data.accessToken;
            token.refreshToken = data.refreshToken;
            const payload = decodeJwt(data.accessToken);
            token.id = payload[
              "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
            ] as string;
            token.name = payload[
              "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
            ] as string;
            token.email = payload[
              "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
            ] as string;
            token.image = payload[
              "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/thumbprint"
            ] as string;
            token.role = payload[
              "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
            ] as string;
            return token;
          }
          return { ...token, error: "RefreshAccessTokenError" };
        } catch (error) {
          console.error("Failed to refresh token:", error);
          return { ...token, error: "RefreshAccessTokenError" };
        }
      }

      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.email = token.email || "";
      session.user.image = token.picture;
      session.user.role = token.role ?? "User";
      session.user.accessToken = token.accessToken;
      session.user.refreshToken = token.refreshToken;
      return session;
    },
    // jwt({ token, account, profile, session }) {
    //   console.log(token, account, profile, session);
    //   if (account?.provider == 'credentials') {
    //     return {
    //       ...token,
    //       accessToken: account.access_token,
    //       refreshToken: account.refresh_token,
    //     };
    //   }
    //   return {
    //     ...token,
    //     // role: user.role,
    //   };
    // },
    // session({ session, token, user }) {
    //   console.log(session, token, user.role);
    //   return {
    //     ...session,
    //   };
    // },
  },
  session: { strategy: "jwt", maxAge: 24 * 60 * 60 },
  pages: {
    signIn: "/login",
    newUser: "/register",
  },
});

const decodeJwt = (token: string): JwtPayload => {
  const payload = jwtDecode<JwtPayload>(token);
  return payload;
};

const isTokenExpired = (token: string, offsetSeconds: number = 0): boolean => {
  const decoded = jwtDecode<JwtPayload>(token);
  const currentTime = Date.now() / 1000; // Convert to seconds
  return decoded.exp < currentTime - offsetSeconds;
};
