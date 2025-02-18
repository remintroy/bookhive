import { verifyIdToken } from "@/lib/firebase-admin";
import { UserRecord } from "firebase-admin/auth";
import { NextRequest, NextResponse } from "next/server";

export const verifyAuth = async (req: NextRequest, next: (user: UserRecord) => Promise<NextResponse<any>>) => {
  try {
    // Get ID token from Authorization header
    const idToken = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!idToken) return NextResponse.json({ error: "ID token is required" }, { status: 400 });

    // Verify Firebase ID Token
    const userRecord = await verifyIdToken(idToken);
    if (!userRecord) return NextResponse.json({ error: "Invalid ID token" }, { status: 401 });

    // Set user data in request context
    return await next(userRecord);
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized: Invalid token" }, { status: 403 });
  }
};
