import { cookies } from "next/headers";
import { verifyRefreshToken, generateAccessToken } from "@/lib/auth";

export async function POST() {
  const refreshToken = cookies().get("refreshToken")?.value;
  if (!refreshToken) {
    return new Response(JSON.stringify({ error: "No refresh token" }), {
      status: 401,
    });
  }

  const decoded = verifyRefreshToken(refreshToken);
  if (!decoded) {
    return new Response(JSON.stringify({ error: "Invalid refresh token" }), {
      status: 403,
    });
  }

  const accessToken = generateAccessToken({ userId: (decoded as any).userId });
  return new Response(JSON.stringify({ accessToken }), { status: 200 });
}
