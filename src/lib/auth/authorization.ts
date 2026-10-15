import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export class UnauthenticatedError extends Error {
  constructor() {
    super("Authentication is required.");
    this.name = "UnauthenticatedError";
  }
}

export class ForbiddenError extends Error {
  constructor() {
    super("You do not have access to this organisation.");
    this.name = "ForbiddenError";
  }
}

/**
 * Resolve identity only from Better Auth's server-verified session cookie.
 * Never accept userId or organisationId from an untrusted browser request as proof.
 */
export async function getVerifiedSessionUserId(): Promise<string> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new UnauthenticatedError();
  return session.user.id;
}

/**
 * An organisation ID selects a tenant; membership is the authorization boundary.
 * Call this before every organisation-scoped read or write.
 */
export async function requireOrganisationContext(organisationId: string) {
  if (!organisationId || !organisationId.trim()) throw new ForbiddenError();

  const userId = await getVerifiedSessionUserId();
  const membership = await db.membership.findUnique({
    where: { userId_organisationId: { userId, organisationId } },
    select: { userId: true, organisationId: true, role: true },
  });

  if (!membership) throw new ForbiddenError();

  return {
    userId: membership.userId,
    organisationId: membership.organisationId,
    role: membership.role,
  };
}
