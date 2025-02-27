import connectToDb from "@/lib/mongodb";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ userId?: string }> }) {
  try {
    const userId = (await params).userId;
    if (!userId) return NextResponse.json({ error: "userId not specified" }, { status: 400 });

    await connectToDb();

    const data = await User.findOne({ uid: userId }, { _id: 0, uid: 1, displayName: 1, photoURL: 1, disabled: 1 });

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Book error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
