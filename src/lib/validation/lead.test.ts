import { describe, expect, it } from "vitest";
import { leadInputSchema } from "./lead";

describe("leadInputSchema", () => {
  it("accepts a minimal valid lead", () => {
    expect(leadInputSchema.safeParse({ name: "Ada Example" }).success).toBe(true);
  });

  it("rejects an invalid email", () => {
    expect(
      leadInputSchema.safeParse({ name: "Ada Example", email: "not-an-email" }).success,
    ).toBe(false);
  });

  it("rejects a negative estimated value", () => {
    expect(
      leadInputSchema.safeParse({ name: "Ada Example", estimatedValue: -1 }).success,
    ).toBe(false);
  });

  it("rejects unsupported currency codes", () => {
    expect(
      leadInputSchema.safeParse({ name: "Ada Example", currency: "XYZ" }).success,
    ).toBe(false);
  });
});
