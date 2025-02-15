import mongoose from "mongoose";

declare global {
  var mongooseConnection: mongoose.Connection;
}

async function connectToDb() {
  const MONGODB_URI = process.env.NODE_ENV == "production" ? process.env.MONGODB_ATLAS_URI : process.env.MONGODB_URI;

  if (!MONGODB_URI) throw new Error("Please define the MONGODB_URI environment variable");

  const existingConnection = global.mongooseConnection;
  if (existingConnection?.readyState == 1) return global.mongooseConnection;

  const newConnection = await mongoose.connect(MONGODB_URI);
  return (global.mongooseConnection = newConnection.connection);
}

export default connectToDb;
