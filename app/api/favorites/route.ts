import connectToDb from "@/lib/mongodb";
import { verifyAuth } from "@/middlewares/verify-auth";
import Books from "@/models/Books";
import Favorites from "@/models/Favorites";
import { UserRecord } from "firebase-admin/auth";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: Promise<{ bookId?: string }> }) {
  const requestHandler = async (user: UserRecord | null) => {
    try {
      const bookId = (await params)?.bookId;

      if (!bookId) return NextResponse.json({ error: "bookId not specified" }, { status: 400 });

      await connectToDb();

      const existingData = await Books.findOne({ _id: new mongoose.Types.ObjectId(bookId) });

      if (!existingData) return NextResponse.json({ error: "Book not found" }, { status: 404 });

      await Favorites.insertOne({ bookId: new mongoose.Types.ObjectId(bookId), userId: user?.uid });

      return NextResponse.json({ message: "Book added to favorites" }, { status: 200 });
    } catch (error) {
      console.error("Favorites error:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  };
  return verifyAuth(req, requestHandler);
}

export async function GET(req: NextRequest) {
  const requestHandler = async (user: UserRecord | null) => {
    try {
      await connectToDb();

      const books = await Favorites.find({ userId: user?.uid });

      return NextResponse.json(books, { status: 200 });
    } catch (error) {
      console.error("Favorites error:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  };
  return verifyAuth(req, requestHandler);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ bookId?: string }> }) {
  const requestHandler = async (user: UserRecord | null) => {
    try {
      const bookId = (await params)?.bookId;

      if (!bookId) return NextResponse.json({ error: "bookId not specified" }, { status: 400 });

      await connectToDb();

      const existingData = await Books.findOne({ _id: new mongoose.Types.ObjectId(bookId) });

      if (!existingData) return NextResponse.json({ error: "Book not found" }, { status: 404 });

      await Favorites.deleteOne({ bookId: new mongoose.Types.ObjectId(bookId), userId: user?.uid });

      return NextResponse.json({ message: "Book removed from favorites" }, { status: 200 });
    } catch (error) {
      console.error("Favorites error:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  };
  return verifyAuth(req, requestHandler);
}
