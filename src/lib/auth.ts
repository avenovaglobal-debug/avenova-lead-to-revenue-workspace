import { betterAuth } from "better-auth";
import { prismaAdapter } from "@better-auth/prisma-adapter";
import { db } from "@/lib/db";

/**
 * Authentication foundation only.
 * Password sign-up stays disabled until email verification and account recovery
 * delivery are implemented and tested. Do not enable without reviewing release gates.
 */
export const auth = betterAuth({
  database: prismaAdapter(db, { provider: "postgresql" }),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  emailAndPassword: {
    // Keep disabled by default. Only enable after a founder account and organisation
    // have been provisioned and the release gates are reviewed.
    enabled: process.env.AVENOVA_ENABLE_PASSWORD_SIGNIN === "true",
    disableSignUp: true,
    minPasswordLength: 12,
    maxPasswordLength: 128,
  },
  trustedOrigins: process.env.BETTER_AUTH_TRUSTED_ORIGINS
    ? process.env.BETTER_AUTH_TRUSTED_ORIGINS.split(",").map((origin) => origin.trim()).filter(Boolean)
    : process.env.BETTER_AUTH_URL
      ? [process.env.BETTER_AUTH_URL]
      : ["http://localhost:3000"],
});
