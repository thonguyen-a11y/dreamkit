import type { FaqItem } from "./types";

/** Support hotline shown on the FAQ + contact surfaces. */
export const SUPPORT_HOTLINE = "0934907570";

export const FAQS: readonly FaqItem[] = [
  {
    id: "custom-design",
    question: "Tôi có thể yêu cầu Dreamkit thiết kế riêng được không?",
    answer:
      `Nếu đội bóng của bạn cần thiết kế riêng, vui lòng liên hệ trực tiếp với Dreamkit qua hotline ${SUPPORT_HOTLINE} để được hỗ trợ nhanh nhất.`,
  },
  {
    id: "lead-time",
    question: "Thời gian thiết kế và sản xuất khoảng bao lâu?",
    answer:
      "Có nhiều gói thiết kế khác nhau, và thời gian dao động từ 3–10 ngày làm việc.",
  },
  {
    id: "team-offers",
    question: "Có ưu đãi gì khi đặt đội không?",
    answer:
      "Có nhiều chương trình ưu đãi khác nhau nếu bạn đặt đội. Các ưu đãi bao gồm giảm phí thiết kế (logo hoặc áo), giảm chi phí sản xuất & quà tặng đi kèm, tuỳ thuộc vào số lượng quần áo và yêu cầu thiết kế.",
  },
];
