import connectToDb from "@/lib/mongodb";
import { verifyAuth } from "@/middlewares/verify-auth";
import Books from "@/models/Books";
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
      console.error("Auth error:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  });
}
