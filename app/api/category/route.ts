import connectToDb from "@/lib/mongodb";
import Books from "@/models/Books";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // Connect to MongoDB
    await connectToDb();

    // Get search query from URL parameters
    const { searchParams } = new URL(req.url);
      const search = searchParams.get("search") || "";

    // Fetch books based on search query
    const categorys = await Books.aggregate([
      {
        $match: { categories: { $exists: true, $ne: [] } },
      },
      {
        $unwind: "$categories",
      },
      {
        $match: {
          categories: { $regex: search, $options: "i" },
        },
      },
      {
        $group: {
          _id: "$categories",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          count: 1,
        },
      },
    ]);

    //
    return NextResponse.json(categorys);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
