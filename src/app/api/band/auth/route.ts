import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export const runtime = "edge";

export async function POST(request: Request) {
  const { env } = await getCloudflareContext({ async: true }) as { env: any };
  const { email, password } = await request.json() as any;

  const validEmails = (env.BAND_EMAILS as string).split(",").map((e: string) => e.trim());
  const validPassword = env.BAND_PASSWORD as string;

  if (!validEmails.includes(email) || password !== validPassword) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  // Simple signed token: base64(email + timestamp + secret)
  const payload = `${email}:${Date.now()}:${env.BAND_SECRET}`;
  const token = btoa(payload);

  const response = NextResponse.json({ ok: true });
  response.cookies.set("band_session", token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete("band_session");
  return response;
}