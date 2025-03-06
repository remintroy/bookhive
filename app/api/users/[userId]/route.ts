import connectToDb from "@/lib/mongodb";
import { verifyAuth } from "@/middlewares/verify-auth";
import User from "@/models/User";
import { UserRecord } from "firebase-admin/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ userId?: string }> }) {
  try {
    const userId = (await params).userId;
    if (!userId) return NextResponse.json({ error: "userId not specified" }, { status: 400 });

    await connectToDb();

    const data = await User.aggregate([
      {
        $match: {
          uid: userId,
        },
      },
      {
        $lookup: {
          from: "books",
          as: "books",
          let: { uid: "$uid" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$$uid", "$seller"],
                },
              },
            },
            {
              $facet: {
                books: [
                  {
                    $project: {
                      _id: 1,
                      title: 1,
                      author: 1,
                      description: 1,
                      categories: 1,
                      condition: 1,
                      location: {
                        address: 1,
                        googleMapUrl: 1,
                      },
                    },
                  },
                ],
                totalBooks: [
                  {
                    $count: "count",
                  },
                ],
                totalSold: [
                  {
                    $match: {
                      isSold: true,
                    },
                  },
                  {
                    $count: "count",
                  },
                ],
              },
            },
            {
              $project: {
                totalBooks: {
                  $ifNull: [{ $arrayElemAt: ["$totalBooks.count", 0] }, 0],
                },
                totalSold: {
                  $ifNull: [{ $arrayElemAt: ["$totalSold.count", 0] }, 0],
                },
                books: "$books",
              },
            },
          ],
        },
      },
      {
        $set: { books: { $arrayElemAt: ["$books", 0] } },
      },
      {
        $project: {
          _id: 0,
          uid: 1,
          displayName: 1,
          photoURL: 1,
          photoURLCustom: 1,
          disabled: 1,
          books: 1,
          bio: 1,
          createdAt: 1,
        },
      },
    ]);

    return NextResponse.json(data?.[0] || {}, { status: 200 });
  } catch (error) {
    console.error("Book error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ userId?: string }> }) {
  const requestHandler = async (user: UserRecord | null) => {
    try {
      const userId = (await params).userId;
      if (!userId) return NextResponse.json({ error: "userId not specified" }, { status: 400 });

      if (userId !== user?.uid) {
        return NextResponse.json({ error: "You don't have permission to update this data" }, { status: 403 });
      }

      const dataToUpdate = await req.json();

      await connectToDb();

      await User.updateOne({ uid: userId }, { $set: dataToUpdate });

      return NextResponse.json(dataToUpdate || {}, { status: 200 });
    } catch (error) {
      console.error("Book error:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  };

  return verifyAuth(req, requestHandler);
}
