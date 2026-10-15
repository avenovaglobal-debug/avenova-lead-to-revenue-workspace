import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  leadFindMany: vi.fn(),
  leadCreate: vi.fn(),
  auditCreate: vi.fn(),
  transaction: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  db: {
    lead: { findMany: mocks.leadFindMany, create: mocks.leadCreate },
    auditEvent: { create: mocks.auditCreate },
    $transaction: mocks.transaction,
  },
}));

import { createLead, listLeads } from "./service";
import type { VerifiedOrganisationContext } from "./service";
import type { LeadInput } from "@/lib/validation/lead";

const context: VerifiedOrganisationContext = {
  userId: "user-a",
  organisationId: "org-a",
  role: "MEMBER",
};

describe("tenant-scoped lead service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("limits lead listing to the verified organisation and applies a bounded page size", async () => {
    mocks.leadFindMany.mockResolvedValue([]);

    await listLeads(context);

    expect(mocks.leadFindMany).toHaveBeenCalledWith({
      where: { organisationId: "org-a" },
      orderBy: { updatedAt: "desc" },
      take: 100,
    });
  });

  it("writes the lead and audit event in one transaction using server-derived tenant identity", async () => {
    const lead = { id: "lead-a", organisationId: "org-a", createdById: "user-a" };
    const tx = {
      lead: { create: vi.fn().mockResolvedValue(lead) },
      auditEvent: { create: vi.fn().mockResolvedValue({ id: "audit-a" }) },
    };
    mocks.transaction.mockImplementation(async (callback: (tx: typeof tx) => unknown) => callback(tx));

    const input = {
      name: "Example lead",
      currency: "NGN",
      source: "website",
    } as LeadInput;

    await expect(createLead(context, input)).resolves.toEqual(lead);

    expect(tx.lead.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        organisationId: "org-a",
        createdById: "user-a",
        name: "Example lead",
        currency: "NGN",
      }),
    });
    expect(tx.auditEvent.create).toHaveBeenCalledWith({
      data: {
        organisationId: "org-a",
        actorUserId: "user-a",
        action: "lead.created",
        entityType: "Lead",
        entityId: "lead-a",
        metadata: { source: "website" },
      },
    });
  });
});
