import { leadInputSchema } from "@/lib/validation/lead";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const unavailable = () =>
  Response.json(
    { error: "Lead workspace access is not configured for this deployment." },
    { status: 503, headers: { "Cache-Control": "no-store" } },
  );

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function authErrorResponse(error: unknown) {
  if (error instanceof Error && error.name === "UnauthenticatedError") {
    return Response.json(
      { error: "Sign in is required." },
      { status: 401, headers: { "Cache-Control": "no-store" } },
    );
  }
  if (error instanceof Error && error.name === "ForbiddenError") {
    return Response.json(
      { error: "You do not have access to this organisation." },
      { status: 403, headers: { "Cache-Control": "no-store" } },
    );
  }
  return null;
}

function isConfigured() {
  return Boolean(
    process.env.DATABASE_URL &&
      process.env.BETTER_AUTH_SECRET &&
      process.env.BETTER_AUTH_URL,
  );
}

/** Lists leads only after server-side session and organisation membership checks. */
export async function GET(request: Request) {
  if (!isConfigured()) return unavailable();

  const organisationId = new URL(request.url).searchParams.get("organisationId");
  if (!organisationId?.trim()) {
    return Response.json(
      { error: "organisationId is required." },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    const [{ requireOrganisationContext }, { listLeads }] = await Promise.all([
      import("@/lib/auth/authorization"),
      import("@/lib/leads/service"),
    ]);
    const context = await requireOrganisationContext(organisationId);
    const leads = await listLeads(context);
    return Response.json({ leads }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    const response = authErrorResponse(error);
    if (response) return response;
    console.error("GET /api/leads failed");
    return Response.json(
      { error: "Unable to load leads right now." },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}

/** Creates a lead and its audit event through the existing transactional service. */
export async function POST(request: Request) {
  if (!isConfigured()) return unavailable();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "Request body must be valid JSON." },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  if (!isObject(body) || typeof body.organisationId !== "string" || !body.organisationId.trim()) {
    return Response.json(
      { error: "organisationId is required." },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  const parsed = leadInputSchema.safeParse(body.lead);
  if (!parsed.success) {
    return Response.json(
      { error: "Lead details are invalid.", issues: parsed.error.issues },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    const [{ requireOrganisationContext }, { createLead }] = await Promise.all([
      import("@/lib/auth/authorization"),
      import("@/lib/leads/service"),
    ]);
    const context = await requireOrganisationContext(body.organisationId);
    const lead = await createLead(context, parsed.data);
    return Response.json(
      { lead },
      { status: 201, headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    const response = authErrorResponse(error);
    if (response) return response;
    console.error("POST /api/leads failed");
    return Response.json(
      { error: "Unable to create the lead right now." },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
