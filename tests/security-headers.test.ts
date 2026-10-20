import { describe, expect, it } from "vitest";
import nextConfig from "../next.config";

describe("HTTP security header baseline", () => {
  it("disables framework identification and enables strict mode", () => {
    expect(nextConfig.poweredByHeader).toBe(false);
    expect(nextConfig.reactStrictMode).toBe(true);
  });

  it("sets defensive headers for every route", async () => {
    const rules = await nextConfig.headers?.();
    expect(rules).toHaveLength(1);
    expect(rules?.[0]?.source).toBe("/:path*");

    const headers = Object.fromEntries(
      (rules?.[0]?.headers ?? []).map(({ key, value }) => [key, value]),
    );
    expect(headers["X-Content-Type-Options"]).toBe("nosniff");
    expect(headers["X-Frame-Options"]).toBe("DENY");
    expect(headers["Referrer-Policy"]).toBe("strict-origin-when-cross-origin");
    expect(headers["Permissions-Policy"]).toContain("camera=()");
    if (process.env.NODE_ENV === "production") {
      expect(headers["Strict-Transport-Security"]).toBe("max-age=31536000");
    } else {
      expect(headers["Strict-Transport-Security"]).toBeUndefined();
    }
  });
});
