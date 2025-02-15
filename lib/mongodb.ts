import mongoose from "mongoose";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).mongooseConnection = (globalThis as any).mongooseConnection || null;

async function connectToDb() {
  const MONGODB_URI = process.env.NODE_ENV == "production" ? process.env.MONGODB_ATLAS_URI : process.env.MONGODB_URI;

  if (!MONGODB_URI) throw new Error("Please define the MONGODB_URI environment variable");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((globalThis as any).mongooseConnection?.readyState === 1) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (globalThis as any).mongooseConnection;
  }

  const newConnection = await mongoose.connect(MONGODB_URI);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).mongooseConnection = newConnection.connection;
  return newConnection.connection;
}

export default connectToDb;
