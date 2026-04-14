import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  const isLoginPage = request.nextUrl.pathname === "/admin/giris";

  if (!isAdminRoute) return NextResponse.next();

  // NextAuth v5 uses AUTH_SECRET, fallback to NEXTAUTH_SECRET
  const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;
  const token = await getToken({ req: request, secret });

  // Pass pathname to layout via header
  const response = NextResponse.next();
  response.headers.set("x-next-pathname", request.nextUrl.pathname);

  if (!isLoginPage && !token) {
    return NextResponse.redirect(new URL("/admin/giris", request.url));
  }

  if (isLoginPage && token) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
