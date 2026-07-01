import { Container } from "@/components/ui/container";

interface FooterColumn {
  readonly title: string;
  readonly links: readonly string[];
}

const FOOTER_COLUMNS: readonly FooterColumn[] = [
  { title: "Khám phá", links: ["Trang chủ", "Cửa hàng", "FAQs"] },
  { title: "Hỗ trợ", links: ["Hướng dẫn đặt hàng", "Chính sách đổi trả", "Vận chuyển"] },
  { title: "Kết nối", links: ["Fanpage", "Zalo", "Hotline"] },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <Container className="grid gap-12 py-16 md:grid-cols-[1.5fr_repeat(3,1fr)]">
        <div className="flex flex-col gap-4">
          <span className="font-display text-2xl font-semibold">Dreamkit</span>
          <p className="max-w-xs text-sm leading-relaxed text-muted">
            Thiết kế &amp; sản xuất áo đấu bóng đá riêng cho từng đội bóng. Tự hào
            là sản phẩm được tạo ra tại Việt Nam.
          </p>
        </div>

        {FOOTER_COLUMNS.map((column) => (
          <nav key={column.title} aria-label={column.title} className="flex flex-col gap-3">
            <h2 className="text-xs font-semibold uppercase tracking-label text-foreground">
              {column.title}
            </h2>
            <ul className="flex flex-col gap-2">
              {column.links.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-sm text-muted transition-colors hover:text-foreground"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </Container>

      <div className="border-t border-border">
        <Container className="flex flex-col items-center justify-between gap-2 py-6 text-xs text-muted sm:flex-row">
          <p>© 2024 — Dreamkit. Mọi quyền được bảo lưu.</p>
          <p>Thiết kế &amp; sản xuất tại Việt Nam</p>
        </Container>
      </div>
    </footer>
  );
}
