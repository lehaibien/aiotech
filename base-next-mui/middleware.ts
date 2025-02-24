import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
// export { auth as middleware } from "@/lib/auth";

export default auth(async (req) => {
  const path = req.nextUrl.pathname;
  if (path === "/login" && req.auth) {
    return NextResponse.redirect(new URL("/", req.url));
  }
  // if (path.startsWith('/dashboard') && !req.auth) {
  //   return NextResponse.redirect(new URL('/login', req.url));
  // }
  // if (path.startsWith('/dashboard') && req.auth?.user.role !== 'Admin') {
  //   console.log(req.auth?.user)
  //   return NextResponse.redirect(new URL('/no-access', req.url));
  // }
  if (path.startsWith("/profile") && !req.auth) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
