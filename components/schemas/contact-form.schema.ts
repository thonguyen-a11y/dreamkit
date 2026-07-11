import { z } from "zod";

export const contactFormSchema = z.object({
  teamName: z
    .string()
    .min(3, "Team name must be at least 3 characters"),

  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 characters"),

  estimateAmount: z
    .enum(["lt_10m", "10m_20m", "gt_20m"], {
      message: "Estimate amount must be invalid",
    })
});

export type ContactFormType = z.infer<typeof contactFormSchema>;