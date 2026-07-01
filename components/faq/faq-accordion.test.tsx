import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { FaqItem } from "@/lib/types";
import { FaqAccordion } from "./faq-accordion";

const ITEMS: readonly FaqItem[] = [
  { id: "one", question: "Question one", answer: "Answer one" },
  { id: "two", question: "Question two", answer: "Answer two" },
];

function expanded(name: string): string | null {
  return screen
    .getByRole("button", { name })
    .getAttribute("aria-expanded");
}

describe("FaqAccordion", () => {
  it("expands the first item by default", () => {
    render(<FaqAccordion items={ITEMS} />);

    expect(expanded("Question one")).toBe("true");
    expect(expanded("Question two")).toBe("false");
  });

  it("toggles an item open and closed on click", () => {
    render(<FaqAccordion items={ITEMS} />);
    const second = screen.getByRole("button", { name: "Question two" });

    fireEvent.click(second);
    expect(second.getAttribute("aria-expanded")).toBe("true");

    fireEvent.click(second);
    expect(second.getAttribute("aria-expanded")).toBe("false");
  });

  it("keeps items independent (multiple can be open)", () => {
    render(<FaqAccordion items={ITEMS} />);

    fireEvent.click(screen.getByRole("button", { name: "Question two" }));
    expect(expanded("Question one")).toBe("true");
    expect(expanded("Question two")).toBe("true");
  });

  it("respects an explicit defaultOpenIds", () => {
    render(<FaqAccordion items={ITEMS} defaultOpenIds={["two"]} />);

    expect(expanded("Question one")).toBe("false");
    expect(expanded("Question two")).toBe("true");
  });
});
