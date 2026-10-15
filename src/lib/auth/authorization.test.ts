import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getSession: vi.fn(),
  membershipFindUnique: vi.fn(),
}));

vi.mock("next/headers", () => ({
  headers: vi.fn(async () => new Headers()),
}));

vi.mock("@/lib/auth", () => ({
  auth: { api: { getSession: mocks.getSession } },
}));

vi.mock("@/lib/db", () => ({
  db: { membership: { findUnique: mocks.membershipFindUnique } },
}));

import {
  ForbiddenError,
  getVerifiedSessionUserId,
  requireOrganisationContext,
  UnauthenticatedError,
} from "./authorization";

describe("server-side organisation authorization", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects requests without a verified session", async () => {
    mocks.getSession.mockResolvedValue(null);

    await expect(getVerifiedSessionUserId()).rejects.toBeInstanceOf(
      UnauthenticatedError,
    );
    expect(mocks.membershipFindUnique).not.toHaveBeenCalled();
  });

  it("rejects sessions without a user identity", async () => {
    mocks.getSession.mockResolvedValue({ user: {} });

    await expect(getVerifiedSessionUserId()).rejects.toBeInstanceOf(
      UnauthenticatedError,
    );
  });

  it("rejects an empty organisation selector before checking membership", async () => {
    await expect(requireOrganisationContext("  ")).rejects.toBeInstanceOf(
      ForbiddenError,
    );
    expect(mocks.getSession).not.toHaveBeenCalled();
    expect(mocks.membershipFindUnique).not.toHaveBeenCalled();
  });

  it("denies a verified user who is not a member of the selected organisation", async () => {
    mocks.getSession.mockResolvedValue({ user: { id: "user-a" } });
    mocks.membershipFindUnique.mockResolvedValue(null);

    await expect(requireOrganisationContext("org-b")).rejects.toBeInstanceOf(
      ForbiddenError,
    );
    expect(mocks.membershipFindUnique).toHaveBeenCalledWith({
      where: { userId_organisationId: { userId: "user-a", organisationId: "org-b" } },
      select: { userId: true, organisationId: true, role: true },
    });
  });

  it("returns the membership-scoped context for an authorized user", async () => {
    mocks.getSession.mockResolvedValue({ user: { id: "user-a" } });
    mocks.membershipFindUnique.mockResolvedValue({
      userId: "user-a",
      organisationId: "org-a",
      role: "OWNER",
    });

    await expect(requireOrganisationContext("org-a")).resolves.toEqual({
      userId: "user-a",
      organisationId: "org-a",
      role: "OWNER",
    });
  });
});
