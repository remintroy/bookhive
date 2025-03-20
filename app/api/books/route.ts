import connectToDb from "@/lib/mongodb";
import { verifyAuth } from "@/middlewares/verify-auth";
import Books from "@/models/Books";
import User from "@/models/User";
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
      const limit = Number(searchParams.get("limit") || 100);

      const search = searchParams.get("search") || "";

      let lat = Number(searchParams.get("lat") || "");
      let lon = Number(searchParams.get("lon") || "");

      // const radius = Number(searchParams.get("radius") || 0);

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

      let userIds: string[] = [];

      try {
        userIds =
          searchParams
            .get("userIds")
            ?.trim()
            ?.split(",")
            .filter((e) => e)
            ?.map((e) => e?.trim()) || [];
      } catch (error) {
        console.log(error);
      }

      const categorys =
        (searchParams?.get("categorys") || "")
          ?.trim?.()
          ?.split?.(",")
          ?.filter?.((e) => e) || [];

      // Connect to MongoDB
      await connectToDb();

      const userData = await User.findOne({ uid: user?.uid });

      if (userData?.location?.location?.lat && userData?.location?.location?.lon && !lat && !lon) {
        lat = Number(userData?.location?.location?.lat);
        lon = Number(userData?.location?.location?.lon);
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const locationMatchQuery: any = {
        $geoNear: {
          near: { type: "Point", coordinates: [lat, lon] },
          distanceField: "distance",
          spherical: true,
        },
      };

      const response = await Books.aggregate([
        ...(lat && lon ? [locationMatchQuery] : []),
        {
          $match: {
            $and: [
              {
                $or: [{ isSold: { $ne: true } }, { seller: user?.uid }],
              },
              {
                $or: [
                  { title: { $regex: search, $options: "i" } },
                  { author: { $regex: search, $options: "i" } },
                  { categories: { $regex: search, $options: "i" } },
                ],
              },
            ],
            _id: { $nin: excludes },
            ...(categorys?.length > 0 ? { categories: { $in: categorys } } : {}),
            ...(user && !showCreatedByMe ? { seller: { $ne: user?.uid } } : {}),
            ...(userIds?.length > 0 ? { seller: { $in: userIds } } : {}),
          },
        },
        {
          $sort: {
            distance: 1,
            createdAt: -1,
          },
        },
        {
          $skip: (page - 1) * limit,
        },
        {
          $limit: limit,
        },
      ]);

      return NextResponse.json(response, { status: 200 });
    } catch (error) {
      console.error("Book error:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  };

  return await verifyAuth(req, requestHandler, { allowUnauthorized: true });
}
