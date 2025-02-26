import connectToDb from "@/lib/mongodb";
import { verifyAuth } from "@/middlewares/verify-auth";
import Books from "@/models/Books";
import { UserRecord } from "firebase-admin/auth";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  return await verifyAuth(req, async (user) => {
    try {
      const bookData = await req.json();

      // Connect to MongoDB
      await connectToDb();

      const dataToSave = {
        title: bookData?.title,
        author: bookData?.author,
        description: bookData?.description,
        price: 0,
        condition: bookData?.condition,
        categories: bookData?.categories,
        location: {
          type: "Point",
          coordinates: [bookData?.location?.lat, bookData?.location?.lon],
          dataOrigin: bookData?.dataOrigin,
          placeId: bookData?.placeId,
          googleMapUrl: bookData?.googleMapUrl,
          boundingBox: bookData?.boundingBox,
          address: bookData?.address,
          address2: bookData?.address2,
          addressResponse: bookData?.addressResponse,
          pincode: bookData?.pincode,
        },
        seller: user?.uid,
        images: bookData?.images?.filter((e: string) => e?.trim?.()),
        isSold: false,
      };

      // Save book data to MongoDB
      const book = new Books(dataToSave);

      await book.save();

      return NextResponse.json(book, { status: 200 });
    } catch (error) {
      console.error("Book error:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  });
}

export async function GET(req: NextRequest) {
  const requestHandler = async (user: UserRecord | null) => {
    try {
      // Get search query from URL parameters
      const { searchParams } = new URL(req.url);

      const page = Number(searchParams.get("page") || 1);
      const limit = Number(searchParams.get("limit") || 10);

      const search = searchParams.get("search") || "";

      const lat = Number(searchParams.get("lat") || "");
      const lon = Number(searchParams.get("lon") || "");
      const radius = Number(searchParams.get("radius") || 1000 * 50);

      const showCreatedByMe = Boolean(searchParams.get("my-books") && user);

      let excludes: mongoose.Types.ObjectId[] = [];

      try {
        excludes =
          (searchParams?.get("excludes") || "")
            ?.trim?.()
            ?.split?.(",")
            ?.filter?.((e) => e)
            ?.map((e) => new mongoose.Types.ObjectId(e)) || [];
      } catch (error) {
        console.log("Invalid excludes bookId", error);
      }

      const categorys =
        (searchParams?.get("categorys") || "")
          ?.trim?.()
          ?.split?.(",")
          ?.filter?.((e) => e) || [];

      const locationMatchQuery = {
        "location.coordinates": {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [lat, lon],
            },
            ...(radius ? { $maxDistance: radius } : {}),
          },
        },
      };

      // Connect to MongoDB
      await connectToDb();

      // Fetch all books from MongoDB
      const response = await Books.find({
        isSold: { $ne: true },
        _id: { $nin: excludes },
        title: { $regex: search, $options: "i" },
        ...(lat && lon ? locationMatchQuery : {}),
        ...(categorys?.length > 0 ? { categories: { $in: categorys } } : {}),
        ...(user && !showCreatedByMe ? { seller: { $ne: user?.uid } } : {}),
      })
        .skip((page - 1) * limit)
        .limit(limit);

      return NextResponse.json(response, { status: 200 });
    } catch (error) {
      console.error("Book error:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  };

  return await verifyAuth(req, requestHandler, { allowUnauthorized: true });
}
