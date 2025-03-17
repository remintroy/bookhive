import connectToDb from "@/lib/mongodb";
import { verifyAuth } from "@/middlewares/verify-auth";
import Favorites from "@/models/Favorites";
import { UserRecord } from "firebase-admin/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const requestHandler = async (user: UserRecord | null) => {
    try {
      await connectToDb();

      const books = await Favorites.aggregate([
        { $match: { userId: user?.uid } },
        {
          $lookup: {
            from: "books",
            as: "bookData",
            let: { bookId: "$bookId" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$_id", "$$bookId"],
                  },
                  deleted: { $ne: true },
                },
              },
              {
                $project: {
                  _id: 1,
                  title: 1,
                  author: 1,
                  description: 1,
                  categories: 1,
                  condition: 1,
                  images: 1,
                  isSold: 1,
                  bookStatus: 1,
                  location: {
                    address: 1,
                    googleMapUrl: 1,
                  },
                },
              },
            ],
          },
        },
        {
          $set: {
            bookData: { $arrayElemAt: ["$bookData", 0] },
          },
        },
        {
          $project: {
            _id: 0,
            __v: 0,
          },
        },
      ]);

      return NextResponse.json(books, { status: 200 });
    } catch (error) {
      console.error("Favorites error:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  };
  return verifyAuth(req, requestHandler);
}
