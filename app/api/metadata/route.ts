import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { verifyIdToken } from "@/lib/firebase-admin";

export async function GET(req: NextRequest) {
  try {
    // Get ID token from Authorization header
    const idToken = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!idToken) {
      return NextResponse.json({ error: "ID token is required" }, { status: 400 });
    }

    // Verify Firebase ID Token
    const userRecord = await verifyIdToken(idToken);
    if (!userRecord) {
      return NextResponse.json({ error: "Invalid ID token" }, { status: 401 });
    }

    // TODO: Only update the updated date files Rest need to be kept intact
    // TODO: Need to re structure the code after adding user details edit functionality

    // Prepare user data to save
    const userDataToSave = {
      uid: userRecord.uid,
      email: userRecord.email,
      emailVerified: userRecord.emailVerified,
      displayName: userRecord.displayName,
      photoURL: userRecord.photoURL,
      phoneNumber: userRecord.phoneNumber,
      disabled: userRecord.disabled,
      metadata: {
        creationTime: userRecord.metadata.creationTime,
        lastSignInTime: userRecord.metadata.lastSignInTime,
        lastRefreshTime: userRecord.metadata.lastRefreshTime,
      },
      providerData: userRecord.providerData,
      passwordHash: userRecord.passwordHash,
      passwordSalt: userRecord.passwordSalt,
      tokensValidAfterTime: userRecord.tokensValidAfterTime,
      tenantId: userRecord.tenantId,
      lastMetadataFetch: new Date(),
    };

    // Connect to MongoDB
    await dbConnect();

    const existingUser = await User.findOne({ uid: userRecord?.uid }, { _id: 0, passwordHash: 0, passwordSalt: 0 });

    let dataToSave = {};

    if (existingUser) {
      dataToSave = { lastMetadataFetch: new Date(), photoURL: userDataToSave?.photoURL };
    } else {
      dataToSave = userDataToSave;
    }

    // Find user by firebaseUID
    await User.updateOne({ uid: userRecord?.uid }, { $set: dataToSave }, { upsert: true });

    return NextResponse.json(existingUser || userRecord, { status: 200 });
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
