import { z } from "zod";

export const leadInputSchema = z.object({
  name: z.string().trim().min(1).max(160),
  company: z.string().trim().max(160).optional(),
  email: z.string().trim().email().max(254).optional().or(z.literal("")),
  phone: z.string().trim().max(50).optional(),
  source: z.string().trim().max(100).optional(),
  estimatedValue: z.number().finite().nonnegative().max(999999999999).optional(),
  currency: z.enum(["NGN", "USD", "GBP", "EUR"]).default("NGN"),
  nextFollowUpAt: z.string().datetime().optional(),
});

export type LeadInput = z.infer<typeof leadInputSchema>;
