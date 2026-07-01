import Image from "next/image";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { JOURNEY_STORIES } from "@/lib/products";

export function Journey() {
  return (
    <section id="journey" className="bg-surface py-20 lg:py-28">
      <Container className="flex flex-col gap-12">
        <SectionHeading
          eyebrow="Hành trình xuyên Việt"
          title="Dreamkit & hành trình xuyên Việt"
          description="Từ Tây Nguyên đến Thủ Đô, mỗi điểm dừng là một câu chuyện về tình yêu trái bóng tròn."
        />
        <ul className="grid gap-6 md:grid-cols-3">
          {JOURNEY_STORIES.map((story) => (
            <li
              key={story.id}
              className="group flex flex-col overflow-hidden rounded-card border border-border bg-background"
            >
              <div className="relative flex aspect-[4/3] items-end bg-accent p-6">
                <Image
                  src={story.image}
                  alt={story.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-accent/85 via-accent/20 to-transparent"
                  aria-hidden="true"
                />
                <span className="relative font-display text-3xl text-accent-foreground">
                  {story.location}
                </span>
              </div>
              <div className="flex flex-1 flex-col gap-3 p-6">
                <h3 className="font-display text-xl text-foreground">{story.title}</h3>
                <p className="text-sm leading-relaxed text-muted">{story.excerpt}</p>
                <a
                  href="#"
                  className="mt-auto pt-2 text-xs font-medium uppercase tracking-label text-foreground underline-offset-4 group-hover:underline"
                >
                  Xem thêm
                </a>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
