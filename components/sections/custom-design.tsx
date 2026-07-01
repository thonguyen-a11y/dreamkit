import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { ContactForm } from "./contact-form";

interface ProcessStep {
  readonly step: string;
  readonly title: string;
  readonly description: string;
}

const PROCESS_STEPS: readonly ProcessStep[] = [
  {
    step: "01",
    title: "Liên hệ trực tiếp",
    description: "Dreamkit hỗ trợ bạn ngay lập tức qua Facebook hoặc Zalo.",
  },
  {
    step: "02",
    title: "Điền yêu cầu thiết kế",
    description: "Để chúng tôi hiểu hơn về bản sắc và mong muốn của đội bạn.",
  },
  {
    step: "03",
    title: "Hồ sơ nhà thiết kế",
    description: "Người đồng hành cùng đội của bạn xuyên suốt dự án.",
  },
];

export function CustomDesign() {
  return (
    <section id="custom" className="bg-accent py-20 text-accent-foreground lg:py-28">
      <Container className="grid gap-14 lg:grid-cols-2 lg:items-center">
        <div className="flex flex-col gap-10">
          <SectionHeading
            eyebrow="Dịch vụ thiết kế riêng"
            title="Liên hệ thiết kế riêng cho đội của bạn"
            description="Mỗi đội bóng là một câu chuyện. Hãy để chúng tôi biến câu chuyện đó thành bộ kit của riêng bạn."
            className="[&_h2]:text-accent-foreground [&_p]:text-accent-foreground/70 [&_span]:text-highlight"
          />
          <ol className="flex flex-col gap-6">
            {PROCESS_STEPS.map((item) => (
              <li key={item.step} className="flex gap-5">
                <span className="font-display text-2xl text-highlight">{item.step}</span>
                <div className="flex flex-col gap-1 border-t border-accent-foreground/15 pt-1">
                  <h3 className="text-sm font-semibold uppercase tracking-label">
                    {item.title}
                  </h3>
                  <p className="text-sm text-accent-foreground/70">{item.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <ContactForm />
      </Container>
    </section>
  );
}
