"use client";

import Link from "next/link";
import { useAuthModal } from "@/components/auth/auth-modal-context";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

interface UserGuardProps {
  readonly children: React.ReactNode;
}

/** Restricts account routes to signed-in customers and admins. */
export function UserGuard({ children }: UserGuardProps) {
  const { isAuthenticated, open } = useAuthModal();

  if (!isAuthenticated) {
    return (
      <Container className="flex min-h-[60vh] flex-col items-center justify-center gap-4 py-24 text-center">
        <h1 className="font-display text-3xl text-foreground">Tài khoản của bạn</h1>
        <p className="max-w-md text-sm text-muted">
          Đăng nhập để xem thông tin cá nhân và lịch sử đơn hàng.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button onClick={() => open("login")}>Đăng nhập</Button>
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
