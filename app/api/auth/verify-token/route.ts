import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { log } from "util";

export async function POST(req: Request) {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.get("authorization");
    
    const token = authHeader?.split(" ")[1]; // "Bearer <token>"

    if (!token) {
      return NextResponse.json(
        { valid: false, error: "No token provided" },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);
    return NextResponse.json({ valid: true, decoded }, { status: 200 });
  } catch (err: any) {
    console.error("Token verification error:", err.message);

    // Token is invalid or expired
    if (err.name === "TokenExpiredError") {
      return NextResponse.json(
        { valid: false, error: "Token expired" },
        { status: 401 }
      );
    }
    if (err.name === "JsonWebTokenError") {
      return NextResponse.json(
        { valid: false, error: "Invalid token" },
        { status: 401 }
      );
    }

    // Other errors
    return NextResponse.json(
      { valid: false, error: "Server error" },
      { status: 500 }
    );
  }
}
