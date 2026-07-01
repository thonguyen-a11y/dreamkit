import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Container } from "@/components/ui/container";
import { ShopCatalog } from "@/components/shop/shop-catalog";

export const metadata: Metadata = {
  title: "Cửa hàng — Dreamkit",
  description:
    "Khám phá bộ sưu tập áo đấu bóng đá Dreamkit. Lọc theo màu sắc, cổ áo và loại sản phẩm.",
};

export default function ShopPage() {
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
              <li className="text-foreground">Cửa hàng</li>
            </ol>
          </nav>

          <h1 className="mt-6 font-display text-4xl text-foreground sm:text-5xl">
            Cửa hàng
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted">
            Toàn bộ mẫu áo đấu concept của Dreamkit — sẵn sàng tuỳ biến theo bản
            sắc đội bóng của bạn.
          </p>
        </Container>

        <Container className="pb-24">
          <ShopCatalog />
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}
