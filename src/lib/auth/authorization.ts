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
 * The auth provider is intentionally not implemented yet.
 * Replace this function only after integrating real server-verified sessions.
 * Never accept userId or organisationId from an untrusted browser request as proof.
 */
export async function getVerifiedSessionUserId(): Promise<string> {
  throw new UnauthenticatedError();
}

export async function requireOrganisationContext(organisationId: string) {
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
