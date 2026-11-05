import { NextResponse } from "next/server";

const TABLES = ["projects", "certificates", "comments"] as const;

function json(body: Record<string, unknown>, status: number) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const authorization = request.headers.get("authorization");
    const token = new URL(request.url).searchParams.get("token");
    const authorized =
      authorization === `Bearer ${secret}` || token === secret;

    if (!authorized) {
      return json({ ok: false, error: "Unauthorized" }, 401);
    }
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return json({ ok: false, error: "Supabase is not configured" }, 503);
  }

  try {
    const checks = await Promise.all(
      TABLES.map(async (table) => {
        const response = await fetch(
          `${url}/rest/v1/${table}?select=id&limit=1`,
          {
            headers: {
              apikey: anonKey,
              Authorization: `Bearer ${anonKey}`,
              Accept: "application/json",
            },
            cache: "no-store",
            signal: AbortSignal.timeout(10_000),
          },
        );

        return { table, status: response.status, ok: response.ok };
      }),
    );

    const failed = checks.filter((check) => !check.ok);

    return json(
      {
        ok: failed.length === 0,
        checkedAt: new Date().toISOString(),
        checks,
      },
      failed.length === 0 ? 200 : 503,
    );
  } catch (error) {
    return json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Health check failed",
      },
      503,
    );
  }
}
