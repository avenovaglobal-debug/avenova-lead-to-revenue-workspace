import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
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
    enabled: false,
  },
  trustedOrigins: process.env.BETTER_AUTH_TRUSTED_ORIGINS
    ? process.env.BETTER_AUTH_TRUSTED_ORIGINS.split(",").map((origin) => origin.trim()).filter(Boolean)
    : ["http://localhost:3000"],
});
