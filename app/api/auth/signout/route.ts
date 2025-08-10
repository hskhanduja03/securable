import { cookies } from "next/headers";

export async function POST() {
  cookies().set("refreshToken", "", { httpOnly: true, path: "/", maxAge: 0 });
  return new Response(JSON.stringify({ message: "Logged out" }), {
    status: 200,
  });
}
