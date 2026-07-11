"use client";

import Link from "next/link";
import { AdminGuard } from "./admin-guard";
import { AdminNav } from "./admin-nav";
import { Container } from "@/components/ui/container";

interface AdminShellProps {
  readonly children: React.ReactNode;
}

export function AdminShell({ children }: AdminShellProps) {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-surface">
          <Container className="flex h-16 items-center justify-between">
            <div className="flex flex-col">
              <Link href="/admin" className="font-display text-2xl font-semibold">
                Dreamkit Admin
              </Link>
              <p className="text-xs text-muted">Quản lý sản phẩm và đơn hàng</p>
            </div>
            <Link
              href="/"
              className="text-xs font-medium uppercase tracking-label text-foreground underline-offset-4 hover:underline"
            >
              Về cửa hàng
            </Link>
          </Container>
        </header>

        <Container className="grid gap-10 py-10 lg:grid-cols-[220px_1fr]">
          <aside className="h-fit rounded-card border border-border bg-surface p-4">
            <AdminNav />
          </aside>
          <main>{children}</main>
        </Container>
      </div>
    </AdminGuard>
  );
}
