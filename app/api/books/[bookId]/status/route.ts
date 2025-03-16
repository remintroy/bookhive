import connectToDb from "@/lib/mongodb";
import { verifyAuth } from "@/middlewares/verify-auth";
import Books from "@/models/Books";
import { UserRecord } from "firebase-admin/auth";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ bookId?: string }> }) {
  const requestHandler = async (user: UserRecord | null) => {
    try {
      const data = await req.json();
      const bookId = (await params)?.bookId;
      const bookStatus = data?.status?.trim?.();

      if (!bookId) return NextResponse.json({ error: "bookId not specified" }, { status: 400 });

      if (!["available", "pending", "claimed"]?.includes(bookStatus)) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
      }

      await connectToDb();

      const existingData = await Books.findOne({ _id: new mongoose.Types.ObjectId(bookId) });

      if (!existingData) return NextResponse.json({ error: "Book not found" }, { status: 404 });

      if (user?.uid !== existingData?.seller) {
        return NextResponse.json({ error: "You don't have permission to update this item" }, { status: 401 });
      }

      await Books.updateOne(
        { _id: new mongoose.Types.ObjectId(bookId) },
        { $set: { bookStatus, isSold: bookStatus === "claimed" } }
      );

      return NextResponse.json(data, { status: 200 });
    } catch (error) {
      console.error("Book error:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  };
  return verifyAuth(req, requestHandler);
}
