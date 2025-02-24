import { verifyIdToken } from "@/lib/firebase-admin";
import { UserRecord } from "firebase-admin/auth";
import { NextRequest, NextResponse } from "next/server";

export const verifyAuth = async (
  req: NextRequest,
  next: (user: UserRecord | null) => Promise<NextResponse<any>>,
  options?: { allowUnauthorized: boolean }
) => {
  try {
    // Get ID token from Authorization header
    const idToken = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!idToken) {
      if (options?.allowUnauthorized) return next(null); // Allow unauthorized requests
      return NextResponse.json({ error: "ID token is required" }, { status: 400 });
    }

    // Verify Firebase ID Token
    const userRecord = await verifyIdToken(idToken);
    if (!userRecord) {
      if (options?.allowUnauthorized) return next(null); // Allow unauthorized requests
      return NextResponse.json({ error: "Invalid ID token" }, { status: 401 });
    }

    // Set user data in request context
    return await next(userRecord);
  } catch (error) {
    if (options?.allowUnauthorized) return next(null); // Allow unauthorized requests
    return NextResponse.json({ error: "Unauthorized: Invalid token" }, { status: 403 });
  }
};
