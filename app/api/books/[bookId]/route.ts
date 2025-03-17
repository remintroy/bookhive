import { verifyAuth } from "@/middlewares/verify-auth";
import Books from "@/models/Books";
import { UserRecord } from "firebase-admin/auth";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ bookId?: string }> }) {
  const requestHandler = async (user: UserRecord | null) => {
    try {
      const bookId = (await params).bookId;
      if (!bookId) return NextResponse.json({ error: "bookId not specified" }, { status: 400 });

      const data = (
        await Books.aggregate([
          {
            $match: { _id: new mongoose.Types.ObjectId(bookId), deleted: { $ne: true } },
          },
          {
            $lookup: {
              as: "sellerData",
              from: "users",
              let: { seller: "$seller" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: ["$$seller", "$uid"],
                    },
                  },
                },
                {
                  $project: {
                    _id: 0,
                    uid: 1,
                    displayName: 1,
                    photoURL: 1,
                    photoURLCustom: 1,
                    disabled: 1,
                  },
                },
              ],
            },
          },
          {
            $lookup: {
              from: "favorites",
              let: { userId: user?.uid, bookId: new mongoose.Types.ObjectId(bookId) },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [{ $eq: ["$userId", "$$userId"] }, { $eq: ["$bookId", "$$bookId"] }],
                    },
                  },
                },
              ],
              as: "favorited",
            },
          },
          {
            $set: {
              sellerData: { $arrayElemAt: ["$sellerData", 0] },
              favorited: { $gt: [{ $size: "$favorited" }, 0] },
            },
          },
        ])
      )?.[0];

      if (!data) return NextResponse.json({ error: "Book not found" }, { status: 404 });

      return NextResponse.json(data, { status: 200 });
    } catch (error) {
      console.error("Book error:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  };

  return verifyAuth(req, requestHandler, { allowUnauthorized: true });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ bookId?: string }> }) {
  const requestHandler = async (user: UserRecord | null) => {
    try {
      const data = await req.json();
      const bookId = (await params)?.bookId;
      if (!bookId) return NextResponse.json({ error: "bookId not specified" }, { status: 400 });

      const existingData = await Books.findOne({ _id: new mongoose.Types.ObjectId(bookId), deleted: { $ne: true } });
      if (!existingData) return NextResponse.json({ error: "Book not found" }, { status: 404 });

      delete data.seller;
      delete data._id;
      delete data.deleted;

      if (user?.uid !== existingData?.seller) {
        return NextResponse.json({ error: "You don't have permission to update this item" }, { status: 401 });
      }

      await Books.updateOne({ _id: new mongoose.Types.ObjectId(bookId), deleted: { $ne: true } }, { $set: data });
      return NextResponse.json(data, { status: 200 });
    } catch (error) {
      console.error("Book error:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  };
  return verifyAuth(req, requestHandler);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ bookId?: string }> }) {
  const requestHandler = async (user: UserRecord | null) => {
    try {
      const data = await req.json();
      const bookId = (await params)?.bookId;
      if (!bookId) return NextResponse.json({ error: "bookId not specified" }, { status: 400 });

      const existingData = await Books.findOne({ _id: new mongoose.Types.ObjectId(bookId) });
      if (!existingData) return NextResponse.json({ error: "Book not found" }, { status: 404 });

      if (user?.uid !== existingData?.seller) {
        return NextResponse.json({ error: "You don't have permission to update this item" }, { status: 401 });
      }

      await Books.updateOne({ _id: new mongoose.Types.ObjectId(bookId) }, { $set: { deleted: true } });
      return NextResponse.json(data, { status: 200 });
    } catch (error) {
      console.error("Book error:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  };
  return verifyAuth(req, requestHandler);
}
