import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Container } from "@/components/ui/container";
import { UserGuard } from "@/components/user/user-guard";
import { UserProfile } from "@/components/user/user-profile";

export const metadata: Metadata = {
  title: "Tài khoản — Dreamkit",
  description: "Xem thông tin tài khoản và lịch sử đơn hàng Dreamkit.",
};

export default function AccountPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <Container className="py-10">
          <nav aria-label="Breadcrumb" className="text-xs uppercase tracking-label text-muted">
            <ol className="flex items-center gap-2">
              <li>
                <Link href="/" className="hover:text-foreground">
                  Trang chủ
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-foreground">Tài khoản</li>
            </ol>
          </nav>
        </Container>

        <Container className="pb-24">
          <UserGuard>
            <UserProfile />
          </UserGuard>
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}
