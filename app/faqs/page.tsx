import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Container } from "@/components/ui/container";
import { FaqAccordion } from "@/components/faq/faq-accordion";
import { FAQS, SUPPORT_HOTLINE } from "@/lib/faqs";

export const metadata: Metadata = {
  title: "FAQs — Dreamkit",
  description:
    "Câu hỏi thường gặp về dịch vụ thiết kế và sản xuất áo đấu bóng đá của Dreamkit.",
};

export default function FaqsPage() {
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
              <li className="text-foreground">FAQs</li>
            </ol>
          </nav>
        </Container>

        <Container className="grid gap-12 pb-24 lg:grid-cols-[0.8fr_1.2fr]">
          <header className="flex flex-col gap-4">
            <span className="text-xs font-medium uppercase tracking-label text-highlight">
              Hỗ trợ
            </span>
            <h1 className="font-display text-4xl leading-tight text-foreground sm:text-5xl">
              Câu hỏi thường gặp
            </h1>
            <p className="max-w-md text-base leading-relaxed text-muted">
              Những thắc mắc phổ biến nhất về quy trình thiết kế, sản xuất và ưu
              đãi khi đặt áo đấu cùng Dreamkit.
            </p>

            <div className="mt-4 flex flex-col gap-3 rounded-card border border-border bg-surface p-6">
              <p className="text-sm text-muted">Chưa tìm thấy câu trả lời?</p>
              <p className="font-display text-2xl text-foreground">
                Hotline{" "}
                <a
                  href={`tel:${SUPPORT_HOTLINE}`}
                  className="text-highlight underline-offset-4 hover:underline"
                >
                  {SUPPORT_HOTLINE}
                </a>
              </p>
              <p className="text-sm text-muted">
                Liên hệ trực tiếp để được tư vấn thiết kế riêng cho đội của bạn.
              </p>
            </div>
          </header>

          <section aria-label="Danh sách câu hỏi thường gặp">
            <FaqAccordion items={FAQS} />
          </section>
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}
