import { verifyAuth } from "@/middlewares/verify-auth";
import Books from "@/models/Books";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ bookId?: string }> }) {
  const requestHandler = async () => {
    try {
      const bookId = (await params).bookId;
      if (!bookId) return NextResponse.json({ error: "bookId not specified" }, { status: 400 });

      const data = await Books.findById(bookId).lean();
      if (!data) return NextResponse.json({ error: "Book not found" }, { status: 404 });

      return NextResponse.json(data, { status: 200 });
    } catch (error) {
      console.error("Book error:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  };

  return verifyAuth(req, requestHandler, { allowUnauthorized: true });
}
