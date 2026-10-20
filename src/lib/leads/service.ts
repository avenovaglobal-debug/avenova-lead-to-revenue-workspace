import { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import type { LeadInput } from "@/lib/validation/lead";

export type VerifiedOrganisationContext = {
  userId: string;
  organisationId: string;
  role: "OWNER" | "ADMIN" | "MEMBER";
};

/**
 * Call only with a context returned by requireOrganisationContext.
 * No public API route is exposed until real authentication is implemented.
 */
export async function listLeads(context: VerifiedOrganisationContext) {
  return db.lead.findMany({
    where: { organisationId: context.organisationId },
    orderBy: { updatedAt: "desc" },
    take: 100,
  });
}

export async function createLead(
  context: VerifiedOrganisationContext,
  input: LeadInput,
) {
  const estimatedValue =
    input.estimatedValue === undefined
      ? undefined
      : new Prisma.Decimal(input.estimatedValue);

  return db.$transaction(async (tx) => {
    const lead = await tx.lead.create({
      data: {
        organisationId: context.organisationId,
        createdById: context.userId,
        name: input.name,
        company: input.company || null,
        email: input.email || null,
        phone: input.phone || null,
        source: input.source || null,
        estimatedValue,
        currency: input.currency,
        nextFollowUpAt: input.nextFollowUpAt
          ? new Date(input.nextFollowUpAt)
          : null,
      },
    });

    await tx.auditEvent.create({
      data: {
        organisationId: context.organisationId,
        actorUserId: context.userId,
        action: "lead.created",
        entityType: "Lead",
        entityId: lead.id,
        metadata: { source: input.source || null },
      },
    });

    return lead;
  });
}
