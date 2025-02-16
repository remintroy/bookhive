import { getSignedUrlPUT } from "@/lib/r2-bucket";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name, type } = await req.json();

    // Generate key
    const key = `${Date.now()}-${name || "bookhive"}`;

    // Get signed URL
    const url = await getSignedUrlPUT({ fileName: key, fileType: type });

    // Return signed URL
    return NextResponse.json({ url, key }, { status: 200 });
  } catch (error) {
    console.error("Upload URL error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
