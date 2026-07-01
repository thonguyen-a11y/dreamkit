import Image from "next/image";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { TESTIMONIALS } from "@/lib/products";

export function Testimonials() {
  return (
    <section id="feedback" className="bg-background py-20 lg:py-28">
      <Container className="flex flex-col gap-12">
        <SectionHeading
          eyebrow="Feedback khách hàng"
          title="Niềm tin từ các đội bóng"
          description="Hơn một trăm câu lạc bộ trên khắp Việt Nam đã đồng hành cùng Dreamkit."
          align="center"
        />
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((testimonial) => (
            <li
              key={testimonial.id}
              className="flex flex-col overflow-hidden rounded-card border border-border bg-surface"
            >
              <div className="relative aspect-[3/2] overflow-hidden">
                <Image
                  src={testimonial.image}
                  alt={testimonial.club}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col gap-4 p-8">
                <p className="text-sm leading-relaxed text-foreground">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <p className="mt-auto text-xs font-semibold uppercase tracking-label text-muted">
                  {testimonial.club}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
