"use client";

import Link from "next/link";
import { useAuthModal } from "@/components/auth/auth-modal-context";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

interface AdminGuardProps {
  readonly children: React.ReactNode;
}

/** Restricts admin routes to the admin account only. */
export function AdminGuard({ children }: AdminGuardProps) {
  const { isAuthenticated, isAdmin, open } = useAuthModal();

  if (!isAuthenticated) {
    return (
      <Container className="flex min-h-[60vh] flex-col items-center justify-center gap-4 py-24 text-center">
        <h1 className="font-display text-3xl text-foreground">Khu vực quản trị</h1>
        <p className="max-w-md text-sm text-muted">
          Vui lòng đăng nhập bằng tài khoản admin để quản lý sản phẩm và đơn hàng.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button onClick={() => open("login")}>Đăng nhập admin</Button>
          <Link
            href="/"
            className="text-xs font-medium uppercase tracking-label text-foreground underline underline-offset-4"
          >
            Về trang chủ
          </Link>
        </div>
      </Container>
    );
  }

  if (!isAdmin) {
    return (
      <Container className="flex min-h-[60vh] flex-col items-center justify-center gap-4 py-24 text-center">
        <h1 className="font-display text-3xl text-foreground">Không có quyền truy cập</h1>
        <p className="max-w-md text-sm text-muted">
          Trang quản trị chỉ dành cho tài khoản admin. Bạn có thể xem thông tin cá nhân
          và đơn hàng tại trang tài khoản.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/account"
            className="inline-flex h-11 items-center justify-center rounded-card bg-accent px-6 text-xs font-medium uppercase tracking-label text-accent-foreground transition-colors hover:bg-foreground/85"
          >
            Tài khoản của tôi
          </Link>
          <Link
            href="/"
            className="text-xs font-medium uppercase tracking-label text-foreground underline underline-offset-4"
          >
            Về trang chủ
          </Link>
        </div>
      </Container>
    );
  }

  return children;
}
