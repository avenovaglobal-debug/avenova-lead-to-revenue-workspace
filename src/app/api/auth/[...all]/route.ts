export const runtime = "nodejs";

const unavailable = () =>
  Response.json(
    { error: "Authentication is not configured for this deployment." },
    { status: 503, headers: { "Cache-Control": "no-store" } },
  );

async function handleAuth(request: Request): Promise<Response> {
  // Keep the public engineering preview buildable without database credentials.
  // Fail closed until a real database and auth secrets are configured.
  if (
    !process.env.DATABASE_URL ||
    !process.env.BETTER_AUTH_SECRET ||
    !process.env.BETTER_AUTH_URL
  ) {
    return unavailable();
  }

  const [{ toNextJsHandler }, { auth }] = await Promise.all([
    import("better-auth/next-js"),
    import("@/lib/auth"),
  ]);
  const handlers = toNextJsHandler(auth);
  return request.method === "GET"
    ? handlers.GET(request)
    : handlers.POST(request);
}

export const GET = (request: Request) => handleAuth(request);
export const POST = (request: Request) => handleAuth(request);
