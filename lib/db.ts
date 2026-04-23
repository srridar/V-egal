import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI environment variable is not defined");
}


let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = {
    conn: null,
    promise: null,
  };
}

export async function connectToDatabase() {
  // ✅ Return cached connection if exists
  if (cached.conn) return cached.conn;

  // ✅ Create new connection if not exists
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: "chatapp",
      bufferCommands: false,
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    throw err;
  }

  return cached.conn;
}