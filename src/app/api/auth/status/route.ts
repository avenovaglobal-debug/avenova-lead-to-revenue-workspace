export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const configured = Boolean(
    process.env.DATABASE_URL &&
      process.env.BETTER_AUTH_SECRET &&
      process.env.BETTER_AUTH_URL,
  );
  const enabled = configured && process.env.AVENOVA_ENABLE_PASSWORD_SIGNIN === "true";

  return Response.json(
    { configured, signInEnabled: enabled, signUpEnabled: false },
    { headers: { "Cache-Control": "no-store" } },
  );
}
