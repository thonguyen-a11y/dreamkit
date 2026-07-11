import { NextResponse, type NextRequest } from "next/server";
import {
  readSessionFromCookieValue,
  SESSION_COOKIE_KEY,
} from "@/lib/auth";

const repository = "dreamkit";
const basePath =
  process.env.GITHUB_PAGES === "true" ? `/${repository}` : "";

function withBasePath(path: string): string {
  return `${basePath}${path}`;
}

function isAdminPath(pathname: string): boolean {
  const adminRoot = withBasePath("/admin");
  return pathname === adminRoot || pathname.startsWith(`${adminRoot}/`);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isAdminPath(pathname)) {
    return NextResponse.next();
  }

  const user = readSessionFromCookieValue(
    request.cookies.get(SESSION_COOKIE_KEY)?.value,
  );

  if (!user) {
    return NextResponse.redirect(new URL(withBasePath("/"), request.url));
  }

  if (user.role !== "admin") {
    return NextResponse.redirect(new URL(withBasePath("/account"), request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/admin"],
};
